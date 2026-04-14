import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Save, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Phase1 from "./phases/Phase1";
import Phase2 from "./phases/Phase2";
import Phase3 from "./phases/Phase3";
import Phase4 from "./phases/Phase4";
import Phase5 from "./phases/Phase5";
import Phase6 from "./phases/Phase6";
import { toast } from "sonner";

interface ATEWizardProps {
  ateId: number;
  onComplete?: () => void;
}

const PHASES = [
  { number: 1, title: "Identificación del problema", icon: "🔍" },
  { number: 2, title: "Exploración y documentación", icon: "📚" },
  { number: 3, title: "Diseño de la solución", icon: "✏️" },
  { number: 4, title: "Planeación y construcción", icon: "🔧" },
  { number: 5, title: "Evaluación y mejora", icon: "📊" },
  { number: 6, title: "Comunicación y socialización", icon: "🎤" },
];

export default function ATEWizard({ ateId, onComplete }: ATEWizardProps) {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [faseData, setFaseData] = useState<Record<number, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: fases, isLoading } = trpc.ates.getFases.useQuery({ ateId });
  const updateFaseMutation = trpc.ates.updateFase.useMutation();
  const updateATEMutation = trpc.ates.update.useMutation();

  useEffect(() => {
    if (fases) {
      const data: Record<number, any> = {};
      fases.forEach((fase) => {
        data[fase.numeroFase] = fase.contenido;
      });
      setFaseData(data);
    }
  }, [fases]);

  const handleSavePhase = async (phaseNumber: number, content: any) => {
    setIsSaving(true);
    try {
      const fase = fases?.find((f) => f.numeroFase === phaseNumber);
      if (fase) {
        await updateFaseMutation.mutateAsync({
          faseId: fase.id,
          ateId,
          contenido: content,
          completada: true,
        });

        // Actualizar ultimaFaseCompletada
        await updateATEMutation.mutateAsync({
          id: ateId,
          ultimaFaseCompletada: phaseNumber,
        });

        setFaseData((prev) => ({
          ...prev,
          [phaseNumber]: content,
        }));
        toast.success(`Fase ${phaseNumber} guardada correctamente`);
      }
    } catch (error) {
      toast.error("Error al guardar la fase");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentPhase < 6) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const progressPercentage = (currentPhase / 6) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando wizard...</p>
        </div>
      </div>
    );
  }

  const renderPhaseComponent = () => {
    const props = {
      data: faseData[currentPhase] || {},
      onSave: handleSavePhase,
      phaseNumber: currentPhase,
      isSaving,
    };

    switch (currentPhase) {
      case 1:
        return <Phase1 {...props} />;
      case 2:
        return <Phase2 {...props} />;
      case 3:
        return <Phase3 {...props} />;
      case 4:
        return <Phase4 {...props} />;
      case 5:
        return <Phase5 {...props} />;
      case 6:
        return <Phase6 {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Fase {currentPhase} de 6</CardTitle>
              <CardDescription>{PHASES[currentPhase - 1].title}</CardDescription>
            </div>
            <div className="text-3xl">{PHASES[currentPhase - 1].icon}</div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardHeader>
      </Card>

      {/* Phase Indicators */}
      <div className="grid grid-cols-6 gap-2">
        {PHASES.map((phase) => (
          <button
            key={phase.number}
            onClick={() => setCurrentPhase(phase.number)}
            className={`p-3 rounded-lg transition-all text-center text-sm font-medium ${
              phase.number === currentPhase
                ? "bg-primary text-primary-foreground shadow-lg"
                : phase.number < currentPhase
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <div className="text-lg mb-1">{phase.icon}</div>
            <div className="text-xs truncate">{phase.number}</div>
          </button>
        ))}
      </div>

      {/* Phase Content */}
      <Card className="min-h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{PHASES[currentPhase - 1].icon}</span>
            {PHASES[currentPhase - 1].title}
          </CardTitle>
          <CardDescription>
            Completa los campos de esta fase y continúa con la siguiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderPhaseComponent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPhase === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              toast.info("Función de vista previa próximamente disponible");
            }}
          >
            <FileText className="w-4 h-4" />
            Vista Previa
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              toast.info("Función de exportación próximamente disponible");
            }}
          >
            <Save className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentPhase === 6}
          className="gap-2"
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
