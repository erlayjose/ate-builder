import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface Phase1Props {
  data: any;
  onSave: (phaseNumber: number, content: any) => Promise<void>;
  phaseNumber: number;
  isSaving: boolean;
}

export default function Phase1({ data, onSave, phaseNumber, isSaving }: Phase1Props) {
  const [formData, setFormData] = useState({
    problema: data.problema || "",
    contexto: data.contexto || "",
    preguntaOrientadora: data.preguntaOrientadora || "",
    importancia: data.importancia || "",
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Fase de Identificación</p>
          <p>En esta fase, identifica el problema o necesidad real que tu ATE abordará. Define el contexto, plantea una pregunta orientadora y explica por qué es importante.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="problema" className="text-base font-medium">
            Descripción del Problema *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Cuál es el problema o necesidad que deseas resolver?
          </p>
          <Textarea
            id="problema"
            placeholder="Ej: Los estudiantes no tienen acceso a agua potable en la escuela durante los recreos..."
            value={formData.problema}
            onChange={(e) => handleChange("problema", e.target.value)}
            className="min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="contexto" className="text-base font-medium">
            Contexto *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Dónde y cuándo ocurre este problema? ¿Quiénes están afectados?
          </p>
          <Textarea
            id="contexto"
            placeholder="Ej: En nuestra escuela ubicada en la zona rural, durante los meses de verano..."
            value={formData.contexto}
            onChange={(e) => handleChange("contexto", e.target.value)}
            className="min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="preguntaOrientadora" className="text-base font-medium">
            Pregunta Orientadora *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Formula una pregunta que guíe la búsqueda de soluciones
          </p>
          <Input
            id="preguntaOrientadora"
            placeholder="Ej: ¿Cómo podemos asegurar el acceso a agua potable para todos los estudiantes?"
            value={formData.preguntaOrientadora}
            onChange={(e) => handleChange("preguntaOrientadora", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="importancia" className="text-base font-medium">
            ¿Por qué es importante? *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Justifica por qué este problema merece ser resuelto
          </p>
          <Textarea
            id="importancia"
            placeholder="Ej: La deshidratación afecta el rendimiento académico y la salud de los estudiantes..."
            value={formData.importancia}
            onChange={(e) => handleChange("importancia", e.target.value)}
            className="min-h-20"
          />
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200 p-4">
        <p className="text-sm text-amber-900">
          <span className="font-medium">💡 Consejo:</span> Asegúrate de que el problema sea específico, observable y relevante para tus estudiantes. Esto facilitará el desarrollo de soluciones efectivas.
        </p>
      </Card>

      <Button
        onClick={handleSave}
        disabled={isSaving || !formData.problema || !formData.contexto || !formData.preguntaOrientadora}
        className="w-full"
        size="lg"
      >
        {isSaving ? "Guardando..." : "Guardar Fase 1"}
      </Button>
    </div>
  );
}
