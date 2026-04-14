import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getUserATEs, getATEWithFases, createATE, updateATE, deleteATE, duplicateATE, getOrCreateATEFases, updateATEFase, getPlantillas, getPlantillasByTipo } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  ates: router({
    list: protectedProcedure.query(({ ctx }) => getUserATEs(ctx.user.id)),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ ctx, input }) => getATEWithFases(input.id, ctx.user.id)),

    create: protectedProcedure
      .input(z.object({
        nombre: z.string(),
        grado: z.string().optional(),
        competencia: z.string().optional(),
        tipo: z.enum(["producto", "proceso", "sistema"]),
        descripcion: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await createATE({
          userId: ctx.user.id,
          ...input,
          estado: "borrador",
          ultimaFaseCompletada: 0,
        });
        const ateId = (result as any).insertId as number;
        await getOrCreateATEFases(ateId);
        return { id: ateId };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        nombre: z.string().optional(),
        grado: z.string().optional(),
        competencia: z.string().optional(),
        tipo: z.enum(["producto", "proceso", "sistema"]).optional(),
        descripcion: z.string().optional(),
        estado: z.enum(["borrador", "en_progreso", "completada"]).optional(),
        ultimaFaseCompletada: z.number().optional(),
      }))
      .mutation(({ ctx, input }) => {
        const { id, ...data } = input;
        return updateATE(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => deleteATE(input.id, ctx.user.id)),

    duplicate: protectedProcedure
      .input(z.object({ id: z.number(), newName: z.string() }))
      .mutation(({ ctx, input }) => duplicateATE(input.id, ctx.user.id, input.newName)),

    getFases: protectedProcedure
      .input(z.object({ ateId: z.number() }))
      .query(({ ctx, input }) => getOrCreateATEFases(input.ateId)),

    updateFase: protectedProcedure
      .input(z.object({
        faseId: z.number(),
        ateId: z.number(),
        contenido: z.any().optional(),
        completada: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { faseId, ateId, ...data } = input;
        await updateATEFase(faseId, ateId, ctx.user.id, data);
        return { success: true };
      }),
  }),

  plantillas: router({
    list: publicProcedure.query(() => getPlantillas()),

    getByTipo: publicProcedure
      .input(z.object({ tipo: z.enum(["producto", "proceso", "sistema"]) }))
      .query(({ input }) => getPlantillasByTipo(input.tipo)),
  }),
});

export type AppRouter = typeof appRouter;
