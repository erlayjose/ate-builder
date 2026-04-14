import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Search } from "lucide-react";

interface Phase2Props {
  data: any;
  onSave: (phaseNumber: number, content: any) => Promise<void>;
  phaseNumber: number;
  isSaving: boolean;
}

export default function Phase2({ data, onSave, phaseNumber, isSaving }: Phase2Props) {
  const [formData, setFormData] = useState({
    investigacion: data.investigacion || "",
    ideas: data.ideas || [],
    mejorIdea: data.mejorIdea || "",
    justificacion: data.justificacion || "",
  });

  const [newIdea, setNewIdea] = useState("");

  const handleAddIdea = () => {
    if (newIdea.trim()) {
      setFormData((prev) => ({
        ...prev,
        ideas: [...prev.ideas, newIdea],
      }));
      setNewIdea("");
    }
  };

  const handleRemoveIdea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ideas: prev.ideas.filter((_: string, i: number) => i !== index),
    }));
  };

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
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
        <Search className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-purple-900">
          <p className="font-medium mb-1">Fase de Exploración</p>
          <p>Investiga el problema, genera múltiples ideas de solución y selecciona la más prometedora con justificación clara.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="investigacion" className="text-base font-medium">
            Investigación Realizada *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Qué investigación hiciste? ¿Qué información encontraste?
          </p>
          <Textarea
            id="investigacion"
            placeholder="Ej: Consultamos con estudiantes, revisamos documentos sobre sistemas de agua, investigamos tecnologías sostenibles..."
            value={formData.investigacion}
            onChange={(e) => handleChange("investigacion", e.target.value)}
            className="min-h-24"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            Lluvia de Ideas *
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Genera múltiples ideas de solución (sin filtrar)
          </p>
          
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Escribe una idea..."
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddIdea()}
            />
            <Button
              onClick={handleAddIdea}
              variant="outline"
              size="icon"
              className="flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {formData.ideas.map((idea: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-muted p-3 rounded-lg"
              >
                <span className="text-sm">{idea}</span>
                <button
                  onClick={() => handleRemoveIdea(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="mejorIdea" className="text-base font-medium">
            Mejor Idea Seleccionada *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Cuál es la idea que implementarás?
          </p>
          <Textarea
            id="mejorIdea"
            placeholder="Ej: Instalar un sistema de recolección y purificación de agua de lluvia..."
            value={formData.mejorIdea}
            onChange={(e) => handleChange("mejorIdea", e.target.value)}
            className="min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="justificacion" className="text-base font-medium">
            Justificación de la Selección *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            ¿Por qué elegiste esta idea sobre las otras?
          </p>
          <Textarea
            id="justificacion"
            placeholder="Ej: Es sostenible, accesible económicamente, educativa y resuelve el problema de manera integral..."
            value={formData.justificacion}
            onChange={(e) => handleChange("justificacion", e.target.value)}
            className="min-h-20"
          />
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200 p-4">
        <p className="text-sm text-amber-900">
          <span className="font-medium">💡 Consejo:</span> En la lluvia de ideas no hay respuestas incorrectas. Genera tantas opciones como sea posible antes de seleccionar la mejor.
        </p>
      </Card>

      <Button
        onClick={handleSave}
        disabled={
          isSaving ||
          !formData.investigacion ||
          !formData.mejorIdea ||
          !formData.justificacion ||
          formData.ideas.length === 0
        }
        className="w-full"
        size="lg"
      >
        {isSaving ? "Guardando..." : "Guardar Fase 2"}
      </Button>
    </div>
  );
}
