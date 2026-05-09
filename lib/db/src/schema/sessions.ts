import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  name1: text("name1").notNull(),
  name2: text("name2").notNull(),
  gender1: text("gender1").notNull(),
  gender2: text("gender2").notNull(),
  dob1: text("dob1").notNull(),
  dob2: text("dob2").notNull(),
  zodiac1: integer("zodiac1").notNull(),
  zodiac2: integer("zodiac2").notNull(),
  element1: text("element1").notNull(),
  element2: text("element2").notNull(),
  score: integer("score").notNull(),
  lang: text("lang").notNull(),
  answers: text("answers"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  browser: text("browser"),
  os: text("os"),
  country: text("country"),
  city: text("city"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessionsTable).omit({ id: true, createdAt: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionsTable.$inferSelect;
