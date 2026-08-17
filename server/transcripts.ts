import { and, eq } from "drizzle-orm";
import { YoutubeTranscript, YoutubeTranscriptError } from "youtube-transcript";
import { getDb } from "./db";
import { transcriptSegments, videos } from "../drizzle/schema";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export type TranscriptSegmentResult = {
  segmentIndex: number;
  startMs: number;
  endMs: number;
  text: string;
};

export type TranscriptResult = {
  videoId: string;
  sourceUrl: string;
  language: string;
  status: "ready" | "unavailable" | "error";
  cacheState: "hit" | "miss" | "stale" | "bypass";
  transcriptSource: "youtube_caption" | "cache" | null;
  fetchedAt: string | null;
  expiresAt: string | null;
  segments: TranscriptSegmentResult[];
  message?: string;
};

export function extractYoutubeVideoId(input: string) {
  const trimmed = input.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i);
  const id = match?.[1] ?? (trimmed.match(/^[\w-]{6,}$/)?.[0] ?? null);
  if (!id) throw new Error("Enter a valid YouTube URL or video ID.");
  return id;
}

function normalizeSegments(items: Array<{ text: string; offset: number; duration: number }>) {
  return items
    .map((item, index) => ({
      segmentIndex: index,
      startMs: Math.max(0, Math.round(item.offset)),
      endMs: Math.max(0, Math.round(item.offset + item.duration)),
      text: item.text.replace(/\s+/g, " ").trim(),
    }))
    .filter((item) => item.text.length > 0 && item.endMs >= item.startMs);
}

async function fetchLiveTranscript(videoId: string, language: string) {
  const response = await YoutubeTranscript.fetchTranscript(videoId, { lang: language });
  return normalizeSegments(response);
}

function mapStatus(error: unknown): "unavailable" | "error" {
  return error instanceof YoutubeTranscriptError ? "unavailable" : "error";
}

export async function getTranscript(input: string, language = "en", bypassCache = false): Promise<TranscriptResult> {
  const videoId = extractYoutubeVideoId(input);
  const sourceUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const db = await getDb();
  const now = new Date();

  if (db && !bypassCache) {
    const cached = await db.select().from(videos).where(and(eq(videos.videoId, videoId), eq(videos.language, language))).limit(1);
    const video = cached[0];
    if (video?.transcriptStatus === "ready" && video.expiresAt && video.expiresAt > now) {
      const rows = await db.select({ segmentIndex: transcriptSegments.segmentIndex, startMs: transcriptSegments.startMs, endMs: transcriptSegments.endMs, text: transcriptSegments.text }).from(transcriptSegments).where(and(eq(transcriptSegments.videoId, videoId), eq(transcriptSegments.language, language))).limit(5000);
      return {
        videoId,
        sourceUrl,
        language,
        status: "ready",
        cacheState: "hit",
        transcriptSource: "cache",
        fetchedAt: video.fetchedAt?.toISOString() ?? null,
        expiresAt: video.expiresAt?.toISOString() ?? null,
        segments: rows,
      };
    }
  }

  try {
    const segments = await fetchLiveTranscript(videoId, language);
    if (segments.length === 0) throw new Error("The caption track returned no readable segments.");
    const fetchedAt = new Date();
    const expiresAt = new Date(fetchedAt.getTime() + CACHE_TTL_MS);

    if (db) {
      await db.insert(videos).values({ videoId, sourceUrl, language, transcriptStatus: "ready", transcriptSource: "youtube_caption", fetchedAt, expiresAt, lastError: null }).onDuplicateKeyUpdate({ set: { sourceUrl, transcriptStatus: "ready", transcriptSource: "youtube_caption", fetchedAt, expiresAt, lastError: null } });
      await db.delete(transcriptSegments).where(and(eq(transcriptSegments.videoId, videoId), eq(transcriptSegments.language, language)));
      if (segments.length > 0) await db.insert(transcriptSegments).values(segments.map((segment) => ({ videoId, language, ...segment })));
    }

    return { videoId, sourceUrl, language, status: "ready", cacheState: bypassCache ? "bypass" : "miss", transcriptSource: "youtube_caption", fetchedAt: fetchedAt.toISOString(), expiresAt: expiresAt.toISOString(), segments };
  } catch (error) {
    const status = mapStatus(error);
    const message = error instanceof Error ? error.message : "Transcript provider failed.";
    if (db) {
      await db.insert(videos).values({ videoId, sourceUrl, language, transcriptStatus: status, transcriptSource: null, lastError: message }).onDuplicateKeyUpdate({ set: { transcriptStatus: status, lastError: message, updatedAt: new Date() } });
    }
    return { videoId, sourceUrl, language, status, cacheState: bypassCache ? "bypass" : "stale", transcriptSource: null, fetchedAt: null, expiresAt: null, segments: [], message };
  }
}
