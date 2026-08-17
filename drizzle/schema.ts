import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  videoId: varchar("videoId", { length: 32 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 512 }).notNull(),
  title: varchar("title", { length: 512 }),
  durationSeconds: int("durationSeconds"),
  language: varchar("language", { length: 16 }).notNull().default("en"),
  transcriptStatus: mysqlEnum("transcriptStatus", ["ready", "unavailable", "error"]).notNull().default("ready"),
  transcriptSource: varchar("transcriptSource", { length: 64 }),
  fetchedAt: timestamp("fetchedAt"),
  expiresAt: timestamp("expiresAt"),
  lastError: text("lastError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  videoLanguageUnique: uniqueIndex("videos_video_language_unique").on(table.videoId, table.language),
  expiresIndex: index("videos_expires_idx").on(table.expiresAt),
}));

export const transcriptSegments = mysqlTable("transcriptSegments", {
  id: int("id").autoincrement().primaryKey(),
  videoId: varchar("videoId", { length: 32 }).notNull(),
  language: varchar("language", { length: 16 }).notNull().default("en"),
  segmentIndex: int("segmentIndex").notNull(),
  startMs: int("startMs").notNull(),
  endMs: int("endMs").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  videoLanguageIndex: index("transcript_segments_video_language_idx").on(table.videoId, table.language),
  segmentUnique: uniqueIndex("transcript_segments_video_language_index_unique").on(table.videoId, table.language, table.segmentIndex),
}));

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;
export type TranscriptSegment = typeof transcriptSegments.$inferSelect;
export type InsertTranscriptSegment = typeof transcriptSegments.$inferInsert;
