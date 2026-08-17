import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getTranscript } from "./transcripts";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  video: router({
    getTranscript: publicProcedure
      .input(z.object({ url: z.string().min(1).max(512), language: z.string().min(2).max(16).default("en"), bypassCache: z.boolean().default(false) }))
      .query(({ input }) => getTranscript(input.url, input.language, input.bypassCache)),
  }),
});

export type AppRouter = typeof appRouter;
