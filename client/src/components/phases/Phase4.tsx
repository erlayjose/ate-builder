import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Wrench } from "lucide-react";

interface Phase4Props {
  data: any;
  onSave: (phaseNumber: number, content: any) => Promise<void>;
  phaseNumber: number;
  isSaving: boolean;
}

export default function Phase4({ data, onSave, phaseNumber, isSaving }: Phase4Props) {
  const [formData, setFormData] = useState({
    planificacion: data.planificacion || "",
    pasos: data.pasos || "",
    cronograma: data.cronograma || "",
    responsables: data.responsables || "",
    desafios: data.desafios || "",
    avances: data.avances || "",
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
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
        <Wrench className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-orange-900">
          <p className="font-medium mb-1">Fase de Construcción</p>
          <p>Planifica el proceso de construcción, define los pasos, cronograma y responsables. Registra los avances y desafíos encontrados.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="planificacion" className="text-base font-medium">
            Plan de Construcción *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Cómo organizarás el proceso de construcción?
          </p>
          <Textarea
            id="planificacion"
            placeholder="Ej: Dividiremos el trabajo en equipos: uno para el tanque, otro para los filtros, otro para la bomba..."
            value={formData.planificacion}
            onChange={(e) => handleChange("planificacion", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="pasos" className="text-base font-medium">
            Pasos de Construcción *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Detalla los pasos principales (numerados)
          </p>
          <Textarea
            id="pasos"
            placeholder="Ej: 1. Preparar el tanque\n2. Instalar las tuberías\n3. Montar los filtros\n4. Instalar la bomba..."
            value={formData.pasos}
            onChange={(e) => handleChange("pasos", e.target.value)}
            className="min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="cronograma" className="text-base font-medium">
            Cronograma *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Cuánto tiempo llevará cada fase?
          </p>
          <Textarea
            id="cronograma"
            placeholder="Ej: Semana 1: Preparación de materiales\nSemana 2: Construcción del tanque\nSemana 3: Instalación de filtros..."
            value={formData.cronograma}
            onChange={(e) => handleChange("cronograma", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="responsables" className="text-base font-medium">
            Responsables y Roles *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Quién es responsable de cada tarea?
          </p>
          <Textarea
            id="responsables"
            placeholder="Ej: Equipo A (Juan, María): Tanque\nEquipo B (Pedro, Ana): Filtros\nEquipo C (Luis, Sofia): Bomba..."
            value={formData.responsables}
            onChange={(e) => handleChange("responsables", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="desafios" className="text-base font-medium">
            Desafíos Encontrados
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Qué dificultades surgieron durante la construcción?
          </p>
          <Textarea
            id="desafios"
            placeholder="Ej: Falta de materiales en la zona, dificultad para soldar las tuberías, clima adverso..."
            value={formData.desafios}
            onChange={(e) => handleChange("desafios", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="avances" className="text-base font-medium">
            Avances Registrados
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Describe el progreso realizado
          </p>
          <Textarea
            id="avances"
            placeholder="Ej: Se completó el 80% del tanque, los filtros están listos, falta instalar la bomba..."
            value={formData.avances}
            onChange={(e) => handleChange("avances", e.target.value)}
            className="min-h-20"
          />
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200 p-4">
        <p className="text-sm text-amber-900">
          <span className="font-medium">💡 Consejo:</span> Documenta fotográficamente cada etapa de la construcción. Esto será útil para la presentación final.
        </p>
      </Card>

      <Button
        onClick={handleSave}
        disabled={
          isSaving ||
          !formData.planificacion ||
          !formData.pasos ||
          !formData.cronograma ||
          !formData.responsables
        }
        className="w-full"
        size="lg"
      >
        {isSaving ? "Guardando..." : "Guardar Fase 4"}
      </Button>
    </div>
  );
}
