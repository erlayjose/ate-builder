import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "./trpc";
import { invokeLLM } from "./llm";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  generateAISuggestion: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1, "prompt is required"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Eres un asistente experto en educación tecnológica y diseño de Actividades Tecnológicas Escolares (ATE). Proporciona sugerencias prácticas, específicas y constructivas.",
            },
            {
              role: "user",
              content: input.prompt,
            },
          ],
        });

        const content = response.choices[0]?.message?.content || "";
        return {
          content,
          success: true,
        };
      } catch (error) {
        console.error("Error generating AI suggestion:", error);
        throw new Error("Failed to generate AI suggestion");
      }
    }),
});
