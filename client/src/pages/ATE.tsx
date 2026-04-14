import { useParams, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import ATEWizard from "@/components/ATEWizard";
import { toast } from "sonner";

export default function ATEPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const ateId = parseInt(id || "0");

  const { data: ate, isLoading } = trpc.ates.getById.useQuery(
    { id: ateId },
    { enabled: !!user && ateId > 0 }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!ate) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ATE no encontrada</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold">{ate.nombre}</h1>
            <p className="text-muted-foreground">
              {ate.grado && `Grado: ${ate.grado} • `}
              Tipo: {ate.tipo}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-2">Estado</div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              ate.estado === "completada"
                ? "bg-green-100 text-green-700"
                : ate.estado === "en_progreso"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {ate.estado === "completada"
                ? "Completada"
                : ate.estado === "en_progreso"
                ? "En Progreso"
                : "Borrador"}
            </span>
          </div>
        </div>

        {/* Wizard */}
        <ATEWizard
          ateId={ateId}
          onComplete={() => {
            toast.success("¡ATE completada!");
            navigate("/");
          }}
        />
      </div>
    </div>
  );
}
