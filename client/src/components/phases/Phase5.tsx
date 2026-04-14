import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface Phase5Props {
  data: any;
  onSave: (phaseNumber: number, content: any) => Promise<void>;
  phaseNumber: number;
  isSaving: boolean;
}

export default function Phase5({ data, onSave, phaseNumber, isSaving }: Phase5Props) {
  const [formData, setFormData] = useState({
    funcionamiento: data.funcionamiento || "",
    erroresEncontrados: data.erroresEncontrados || "",
    mejoras: data.mejoras || "",
    resultados: data.resultados || "",
    criteriosEvaluacion: data.criteriosEvaluacion || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    await onSave(phaseNumber, formData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
        <BarChart3 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-900">
          <p className="font-medium mb-1">Fase de Evaluación</p>
          <p>Evalúa el funcionamiento del prototipo, identifica errores, propón mejoras y define criterios de éxito.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="funcionamiento" className="text-base font-medium">
            ¿Cómo funcionó el prototipo? *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Describe el funcionamiento general de tu solución
          </p>
          <Textarea
            id="funcionamiento"
            placeholder="Ej: El sistema recolecta agua de lluvia correctamente, los filtros purifican el agua, la bomba funciona manualmente..."
            value={formData.funcionamiento}
            onChange={(e) => handleChange("funcionamiento", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="erroresEncontrados" className="text-base font-medium">
            Errores o Problemas Encontrados *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Qué no funcionó como se esperaba?
          </p>
          <Textarea
            id="erroresEncontrados"
            placeholder="Ej: Las tuberías tienen fugas, el filtro se satura rápidamente, la bomba requiere mucha fuerza..."
            value={formData.erroresEncontrados}
            onChange={(e) => handleChange("erroresEncontrados", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="mejoras" className="text-base font-medium">
            Mejoras Realizadas o Propuestas *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Qué cambios harías para mejorar?
          </p>
          <Textarea
            id="mejoras"
            placeholder="Ej: Usar tuberías de mejor calidad, aumentar la capacidad del filtro, instalar una bomba eléctrica..."
            value={formData.mejoras}
            onChange={(e) => handleChange("mejoras", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="resultados" className="text-base font-medium">
            Resultados Alcanzados *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Qué objetivos se cumplieron?
          </p>
          <Textarea
            id="resultados"
            placeholder="Ej: Se logró purificar 100L de agua diarios, se redujo el costo en un 40%, los estudiantes tienen acceso a agua segura..."
            value={formData.resultados}
            onChange={(e) => handleChange("resultados", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="criteriosEvaluacion" className="text-base font-medium">
            Criterios de Evaluación del Éxito *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Cómo mediste el éxito de tu ATE?
          </p>
          <Textarea
            id="criteriosEvaluacion"
            placeholder="Ej: Calidad del agua (pH, turbidez), cantidad de agua disponible, costo-beneficio, satisfacción de usuarios..."
            value={formData.criteriosEvaluacion}
            onChange={(e) => handleChange("criteriosEvaluacion", e.target.value)}
            className="min-h-20"
          />
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200 p-4">
        <p className="text-sm text-amber-900">
          <span className="font-medium">💡 Consejo:</span> La evaluación es crucial para el aprendizaje. Sé honesto sobre lo que funcionó y lo que no.
        </p>
      </Card>

      <Button
        onClick={handleSave}
        disabled={
          isSaving ||
          !formData.funcionamiento ||
          !formData.erroresEncontrados ||
          !formData.mejoras ||
          !formData.resultados ||
          !formData.criteriosEvaluacion
        }
        className="w-full"
        size="lg"
      >
        {isSaving ? "Guardando..." : "Guardar Fase 5"}
      </Button>
    </div>
  );
}
