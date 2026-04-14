import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface ATEPreviewProps {
  ate: any;
  fases: any[];
  onClose: () => void;
  onExportPDF: () => void;
}

export default function ATEPreview({ ate, fases, onClose, onExportPDF }: ATEPreviewProps) {
  const phaseNames = [
    "Identificación del problema",
    "Exploración y documentación",
    "Diseño de la solución",
    "Planeación y construcción",
    "Evaluación y mejora",
    "Comunicación y socialización",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-background border-b">
          <CardTitle>Vista Previa - {ate.nombre}</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onExportPDF}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="border-b pb-6">
            <h1 className="text-3xl font-bold mb-2">{ate.nombre}</h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Grado:</span> {ate.grado || "No especificado"}
              </div>
              <div>
                <span className="font-medium">Tipo:</span> {ate.tipo}
              </div>
              <div>
                <span className="font-medium">Competencia:</span> {ate.competencia || "No especificada"}
              </div>
              <div>
                <span className="font-medium">Estado:</span> {ate.estado}
              </div>
            </div>
            {ate.descripcion && (
              <p className="mt-4 text-muted-foreground">{ate.descripcion}</p>
            )}
          </div>

          {/* Phases */}
          {fases.map((fase) => (
            <div key={fase.id} className="space-y-3">
              <h2 className="text-2xl font-bold text-primary">
                Fase {fase.numeroFase}: {phaseNames[fase.numeroFase - 1]}
              </h2>

              {Object.entries(fase.contenido || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  {typeof value === "string" ? (
                    <p className="text-sm whitespace-pre-wrap">{value}</p>
                  ) : Array.isArray(value) ? (
                    <ul className="text-sm space-y-1">
                      {value.map((item: any, idx: number) => (
                        <li key={idx} className="ml-4">• {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">{JSON.stringify(value)}</p>
                  )}
                </div>
              ))}

              {Object.keys(fase.contenido || {}).length === 0 && (
                <p className="text-muted-foreground italic">No hay contenido en esta fase</p>
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="border-t pt-6 text-sm text-muted-foreground">
            <p>Documento generado por ATE Builder</p>
            <p>{new Date().toLocaleDateString("es-ES")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
