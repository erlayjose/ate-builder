import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mic } from "lucide-react";

interface Phase6Props {
  data: any;
  onSave: (phaseNumber: number, content: any) => Promise<void>;
  phaseNumber: number;
  isSaving: boolean;
}

export default function Phase6({ data, onSave, phaseNumber, isSaving }: Phase6Props) {
  const [formData, setFormData] = useState({
    descripcionFinal: data.descripcionFinal || "",
    audienciaDestino: data.audienciaDestino || "",
    formatoPresentacion: data.formatoPresentacion || "",
    mensajePrincipal: data.mensajePrincipal || "",
    aprendizajes: data.aprendizajes || "",
    impacto: data.impacto || "",
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
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex gap-3">
        <Mic className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-900">
          <p className="font-medium mb-1">Fase de Socialización</p>
          <p>Presenta tu ATE a la comunidad educativa. Comparte los resultados, aprendizajes e impacto de tu solución.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="descripcionFinal" className="text-base font-medium">
            Descripción Final del Proyecto *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Resumen ejecutivo de tu ATE
          </p>
          <Textarea
            id="descripcionFinal"
            placeholder="Ej: Nuestro proyecto desarrolló un sistema de purificación de agua sostenible que beneficia a 200 estudiantes de la escuela..."
            value={formData.descripcionFinal}
            onChange={(e) => handleChange("descripcionFinal", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="audienciaDestino" className="text-base font-medium">
            Audiencia Destino *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿A quién le presentarás tu proyecto?
          </p>
          <Textarea
            id="audienciaDestino"
            placeholder="Ej: Directivos de la escuela, estudiantes de otros grados, padres de familia, autoridades locales..."
            value={formData.audienciaDestino}
            onChange={(e) => handleChange("audienciaDestino", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="formatoPresentacion" className="text-base font-medium">
            Formato de Presentación *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Cómo presentarás tu proyecto?
          </p>
          <Textarea
            id="formatoPresentacion"
            placeholder="Ej: Presentación oral con diapositivas, demostración en vivo del prototipo, video documental, feria de ciencias..."
            value={formData.formatoPresentacion}
            onChange={(e) => handleChange("formatoPresentacion", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="mensajePrincipal" className="text-base font-medium">
            Mensaje Principal *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Cuál es el mensaje clave que quieres transmitir?
          </p>
          <Textarea
            id="mensajePrincipal"
            placeholder="Ej: La innovación tecnológica combinada con pensamiento crítico puede resolver problemas reales en nuestras comunidades..."
            value={formData.mensajePrincipal}
            onChange={(e) => handleChange("mensajePrincipal", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="aprendizajes" className="text-base font-medium">
            Aprendizajes Obtenidos *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Qué aprendiste durante el proceso?
          </p>
          <Textarea
            id="aprendizajes"
            placeholder="Ej: Trabajo en equipo, resolución de problemas, pensamiento crítico, aplicación de ciencias y tecnología..."
            value={formData.aprendizajes}
            onChange={(e) => handleChange("aprendizajes", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="impacto" className="text-base font-medium">
            Impacto y Sostenibilidad *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Cuál es el impacto de tu solución? ¿Es sostenible a largo plazo?
          </p>
          <Textarea
            id="impacto"
            placeholder="Ej: Beneficia a 200 estudiantes, reduce gastos en agua, es ambientalmente sostenible, puede replicarse en otras escuelas..."
            value={formData.impacto}
            onChange={(e) => handleChange("impacto", e.target.value)}
            className="min-h-20"
          />
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200 p-4">
        <p className="text-sm text-amber-900">
          <span className="font-medium">💡 Consejo:</span> Una buena presentación incluye datos, evidencias visuales y testimonios de beneficiarios.
        </p>
      </Card>

      <Button
        onClick={handleSave}
        disabled={
          isSaving ||
          !formData.descripcionFinal ||
          !formData.audienciaDestino ||
          !formData.formatoPresentacion ||
          !formData.mensajePrincipal ||
          !formData.aprendizajes ||
          !formData.impacto
        }
        className="w-full"
        size="lg"
      >
        {isSaving ? "Guardando..." : "Guardar Fase 6"}
      </Button>
    </div>
  );
}
