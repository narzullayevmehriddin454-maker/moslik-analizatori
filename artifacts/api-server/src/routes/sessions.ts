import { Router, type IRouter } from "express";
import { db, sessionsTable } from "@workspace/db";
import { desc, sql, eq, and, gte } from "drizzle-orm";
import { CreateSessionBody, ListSessionsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

function parseDevice(ua: string): { deviceType: string; browser: string; os: string } {
  const isBot = /bot|crawler|spider|slurp|bingpreview/i.test(ua);
  if (isBot) return { deviceType: "bot", browser: "bot", os: "bot" };

  const isMobile = /mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua);
  const isTablet = /tablet|ipad/i.test(ua);
  const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  let browser = "other";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  let os = "other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  return { deviceType, browser, os };
}

router.post("/sessions", async (req, res): Promise<void> => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const ua = req.headers["user-agent"] ?? "";
  const { deviceType, browser, os } = parseDevice(ua);
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.socket.remoteAddress ?? null;

  const [session] = await db.insert(sessionsTable).values({
    ...parsed.data,
    ipAddress: ip,
    userAgent: ua || null,
    deviceType,
    browser,
    os,
  }).returning();

  res.status(201).json({
    ...session,
    createdAt: session.createdAt.toISOString(),
  });
});

router.get("/sessions", async (req, res): Promise<void> => {
  const adminCookie = req.cookies?.["moslik_admin"];
  if (adminCookie !== process.env.SESSION_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = ListSessionsQueryParams.safeParse(req.query);
  const page = params.success && params.data.page ? Number(params.data.page) : 1;
  const limit = params.success && params.data.limit ? Number(params.data.limit) : 20;
  const offset = (page - 1) * limit;

  const [rows, countResult] = await Promise.all([
    db.select().from(sessionsTable).orderBy(desc(sessionsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(sessionsTable),
  ]);

  const total = Number(countResult[0]?.count ?? 0);

  res.json({
    sessions: rows.map(s => ({ ...s, createdAt: s.createdAt.toISOString() })),
    total,
    page,
    limit,
  });
});

router.get("/sessions/stats", async (req, res): Promise<void> => {
  const adminCookie = req.cookies?.["moslik_admin"];
  if (adminCookie !== process.env.SESSION_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totals, todayRows, deviceRows, zodiacRows] = await Promise.all([
    db.select({
      total: sql<number>`count(*)`,
      avg: sql<number>`avg(score)`,
      high: sql<number>`sum(case when score >= 70 then 1 else 0 end)`,
      mid: sql<number>`sum(case when score >= 40 and score < 70 then 1 else 0 end)`,
      low: sql<number>`sum(case when score < 40 then 1 else 0 end)`,
    }).from(sessionsTable),
    db.select({ count: sql<number>`count(*)` }).from(sessionsTable).where(gte(sessionsTable.createdAt, today)),
    db.select({
      deviceType: sessionsTable.deviceType,
      count: sql<number>`count(*)`,
    }).from(sessionsTable).groupBy(sessionsTable.deviceType),
    db.select({
      zodiac: sessionsTable.zodiac1,
      count: sql<number>`count(*)`,
    }).from(sessionsTable).groupBy(sessionsTable.zodiac1),
  ]);

  const topLangRows = await db.select({
    lang: sessionsTable.lang,
    count: sql<number>`count(*)`,
  }).from(sessionsTable).groupBy(sessionsTable.lang).orderBy(desc(sql`count(*)`)).limit(1);

  const t = totals[0];
  const deviceBreakdown: Record<string, number> = {};
  for (const r of deviceRows) {
    if (r.deviceType) deviceBreakdown[r.deviceType] = Number(r.count);
  }
  const zodiacBreakdown: Record<string, number> = {};
  for (const r of zodiacRows) {
    if (r.zodiac !== null) zodiacBreakdown[String(r.zodiac)] = Number(r.count);
  }

  res.json({
    totalSessions: Number(t?.total ?? 0),
    avgScore: Math.round(Number(t?.avg ?? 0)),
    highCompatibility: Number(t?.high ?? 0),
    midCompatibility: Number(t?.mid ?? 0),
    lowCompatibility: Number(t?.low ?? 0),
    topLanguage: topLangRows[0]?.lang ?? "UZ",
    todaySessions: Number(todayRows[0]?.count ?? 0),
    deviceBreakdown,
    zodiacBreakdown,
  });
});

export default router;
