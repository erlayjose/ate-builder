import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AIAssistantProps {
  phaseNumber: number;
  currentContent: Record<string, any>;
  onSuggestion: (suggestion: string, field: string) => void;
}

export default function AIAssistant({
  phaseNumber,
  currentContent,
  onSuggestion,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ field: string; text: string }>>([]);

  const phasePrompts: Record<number, string> = {
    1: "Eres un experto en educación tecnológica. Ayuda al docente a identificar un problema real y relevante para los estudiantes. Proporciona ejemplos de problemas tecnológicos que podrían abordarse en una ATE.",
    2: "Eres un experto en metodología de investigación. Ayuda al docente a explorar el problema desde múltiples perspectivas. Sugiere preguntas de investigación y fuentes de información.",
    3: "Eres un experto en diseño de soluciones tecnológicas. Ayuda al docente a diseñar una solución viable. Sugiere criterios de diseño, materiales alternativos y enfoques innovadores.",
    4: "Eres un experto en gestión de proyectos. Ayuda al docente a planificar la construcción del prototipo. Sugiere cronogramas realistas, asignación de roles y estrategias de mitigación de riesgos.",
    5: "Eres un experto en evaluación educativa. Ayuda al docente a evaluar el prototipo de forma integral. Sugiere criterios de evaluación, métricas de éxito y mejoras potenciales.",
    6: "Eres un experto en comunicación educativa. Ayuda al docente a presentar los resultados de forma efectiva. Sugiere estrategias de presentación, mensajes clave y formas de demostrar el impacto.",
  };

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const contentSummary = Object.entries(currentContent)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      const prompt = `${phasePrompts[phaseNumber]}

Contenido actual de la fase:
${contentSummary}

Por favor, proporciona 3 sugerencias específicas y prácticas para mejorar esta fase. Cada sugerencia debe ser concisa, accionable y estar dirigida a un campo específico.

Formato: Campo: Sugerencia`;

      // Llamar al procedimiento tRPC para generar sugerencias con IA
      const response = await trpc.system.generateAISuggestion.useMutation().mutateAsync({
        prompt,
      });

      if (response && response.content && typeof response.content === "string") {
        // Parsear las sugerencias
        const lines = response.content.split("\n").filter((line: string) => line.trim());
        const parsedSuggestions = lines
          .map((line: string) => {
            const parts = line.split(":");
            const field = parts[0]?.trim() || "";
            const text = parts.slice(1).join(":").trim();
            return {
              field,
              text,
            };
          })
          .filter((s: any) => s.field && s.text);

        setSuggestions(parsedSuggestions);
        toast.success("Sugerencias generadas");
      }
    } catch (error) {
      toast.error("Error al generar sugerencias");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
        title="Asistente de IA"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Assistant Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 shadow-2xl z-40 max-h-96 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Asistente de IA
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSuggestions([]);
                }}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              Obtén sugerencias personalizadas de IA para mejorar esta fase
            </p>

            {suggestions.length === 0 ? (
              <Button
                onClick={generateSuggestions}
                disabled={isLoading}
                className="w-full gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generar Sugerencias
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200"
                  >
                    <p className="font-medium text-sm text-purple-900 mb-1">
                      {suggestion.field}
                    </p>
                    <p className="text-sm text-purple-800 mb-2">
                      {suggestion.text}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onSuggestion(suggestion.text, suggestion.field);
                        toast.success("Sugerencia aplicada");
                      }}
                      className="w-full text-xs"
                    >
                      Aplicar
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={() => {
                    setSuggestions([]);
                    generateSuggestions();
                  }}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Regenerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Nuevas Sugerencias
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
}
