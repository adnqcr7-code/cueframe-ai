import { describe, expect, it } from "vitest";
import { extractYoutubeVideoId } from "./transcripts";

describe("transcript provider input handling", () => {
  it("extracts IDs from common YouTube URL shapes", () => {
    expect(extractYoutubeVideoId("https://www.youtube.com/watch?v=abc1234")).toBe("abc1234");
    expect(extractYoutubeVideoId("https://youtu.be/xyz9876")).toBe("xyz9876");
    expect(extractYoutubeVideoId("https://www.youtube.com/shorts/short123")).toBe("short123");
    expect(extractYoutubeVideoId("abc1234")).toBe("abc1234");
  });

  it("rejects empty or non-YouTube input", () => {
    expect(() => extractYoutubeVideoId("")).toThrow("valid YouTube URL");
    expect(() => extractYoutubeVideoId("not a video url")).toThrow("valid YouTube URL");
  });
});
