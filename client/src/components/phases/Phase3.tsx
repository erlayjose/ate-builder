import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";

interface Phase3Props {
  data: any;
  onSave: (phaseNumber: number, content: any) => Promise<void>;
  phaseNumber: number;
  isSaving: boolean;
}

export default function Phase3({ data, onSave, phaseNumber, isSaving }: Phase3Props) {
  const [formData, setFormData] = useState({
    descripcionSolucion: data.descripcionSolucion || "",
    criteriosDiseño: data.criteriosDiseño || "",
    materiales: data.materiales || "",
    herramientas: data.herramientas || "",
    esquema: data.esquema || "",
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
        <Pencil className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-green-900">
          <p className="font-medium mb-1">Fase de Diseño</p>
          <p>Define los criterios de diseño, lista los materiales y herramientas necesarias, y crea un esquema o boceto de tu solución.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="descripcionSolucion" className="text-base font-medium">
            Descripción Detallada de la Solución *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Describe cómo funcionará tu solución
          </p>
          <Textarea
            id="descripcionSolucion"
            placeholder="Ej: El sistema consiste en un tanque de recolección en el techo, filtros de arena y carbón, y una bomba manual..."
            value={formData.descripcionSolucion}
            onChange={(e) => handleChange("descripcionSolucion", e.target.value)}
            className="min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="criteriosDiseño" className="text-base font-medium">
            Criterios de Diseño *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Qué características debe tener tu solución?
          </p>
          <Textarea
            id="criteriosDiseño"
            placeholder="Ej: Debe ser sostenible, económico, fácil de mantener, seguro para los estudiantes..."
            value={formData.criteriosDiseño}
            onChange={(e) => handleChange("criteriosDiseño", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="materiales" className="text-base font-medium">
            Materiales Necesarios *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Lista todos los materiales que necesitarás
          </p>
          <Textarea
            id="materiales"
            placeholder="Ej: Tanque de 500L, tuberías PVC, arena, carbón activado, bomba manual, malla..."
            value={formData.materiales}
            onChange={(e) => handleChange("materiales", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="herramientas" className="text-base font-medium">
            Herramientas Necesarias *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Qué herramientas utilizarás?
          </p>
          <Textarea
            id="herramientas"
            placeholder="Ej: Taladro, sierra, destornilladores, llave inglesa, nivel..."
            value={formData.herramientas}
            onChange={(e) => handleChange("herramientas", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="esquema" className="text-base font-medium">
            Esquema o Boceto
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Describe un boceto o esquema de tu solución (puedes incluir dimensiones, conexiones, etc.)
          </p>
          <Textarea
            id="esquema"
            placeholder="Ej: Tanque en el techo (500L) conectado a filtros en serie, luego a la bomba manual en la base..."
            value={formData.esquema}
            onChange={(e) => handleChange("esquema", e.target.value)}
            className="min-h-20"
          />
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200 p-4">
        <p className="text-sm text-amber-900">
          <span className="font-medium">💡 Consejo:</span> Sé específico con las medidas y cantidades. Esto facilitará la construcción del prototipo.
        </p>
      </Card>

      <Button
        onClick={handleSave}
        disabled={
          isSaving ||
          !formData.descripcionSolucion ||
          !formData.criteriosDiseño ||
          !formData.materiales ||
          !formData.herramientas
        }
        className="w-full"
        size="lg"
      >
        {isSaving ? "Guardando..." : "Guardar Fase 3"}
      </Button>
    </div>
  );
}
