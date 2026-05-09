import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret || parsed.data.password !== secret) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.cookie("moslik_admin", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ authenticated: true });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  res.clearCookie("moslik_admin");
  res.json({ message: "Logged out" });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const adminCookie = req.cookies?.["moslik_admin"];
  const secret = process.env.SESSION_SECRET;
  if (adminCookie && secret && adminCookie === secret) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;
