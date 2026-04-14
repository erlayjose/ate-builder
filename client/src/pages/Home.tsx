import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, Edit2, Copy, Trash2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [newATE, setNewATE] = useState({
    nombre: "",
    grado: "",
    competencia: "",
    tipo: "producto" as "producto" | "proceso" | "sistema",
    descripcion: "",
  });

  const { data: ates, isLoading, refetch } = trpc.ates.list.useQuery(undefined, {
    enabled: !!user,
  });

  const createMutation = trpc.ates.create.useMutation();
  const deleteMutation = trpc.ates.delete.useMutation();
  const duplicateMutation = trpc.ates.duplicate.useMutation();

  const handleCreateATE = async () => {
    if (!newATE.nombre || !newATE.tipo) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    try {
      const result = await createMutation.mutateAsync(newATE);
      toast.success("ATE creada exitosamente");
      setNewATE({ nombre: "", grado: "", competencia: "", tipo: "producto", descripcion: "" });
      refetch();
      navigate(`/ate/${result.id}`);
    } catch (error) {
      toast.error("Error al crear la ATE");
      console.error(error);
    }
  };

  const handleDeleteATE = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta ATE?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("ATE eliminada");
      refetch();
    } catch (error) {
      toast.error("Error al eliminar la ATE");
      console.error(error);
    }
  };

  const handleDuplicateATE = async (id: number, nombre: string) => {
    try {
      const newName = `${nombre} (Copia)`;
      const result = await duplicateMutation.mutateAsync({ id, newName });
      toast.success("ATE duplicada");
      refetch();
    } catch (error) {
      toast.error("Error al duplicar la ATE");
      console.error(error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ATE Builder</CardTitle>
            <CardDescription>
              Constructor de Actividades Tecnológicas Escolares
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Inicia sesión para comenzar a crear tus Actividades Tecnológicas Escolares
            </p>
            <Button size="lg" className="w-full">
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Bienvenido, {user.name}</h1>
          <p className="text-lg text-muted-foreground">
            Crea y gestiona tus Actividades Tecnológicas Escolares de forma guiada
          </p>
        </div>

        {/* Create ATE Button */}
        <div className="mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Crear Nueva ATE
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Actividad Tecnológica Escolar</DialogTitle>
                <DialogDescription>
                  Completa los datos básicos para comenzar tu ATE
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre de la ATE *</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Sistema de purificación de agua"
                    value={newATE.nombre}
                    onChange={(e) =>
                      setNewATE((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="grado">Grado</Label>
                  <Input
                    id="grado"
                    placeholder="Ej: 9°, 10°, 11°"
                    value={newATE.grado}
                    onChange={(e) =>
                      setNewATE((prev) => ({ ...prev, grado: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="competencia">Competencia</Label>
                  <Input
                    id="competencia"
                    placeholder="Ej: Pensamiento tecnológico"
                    value={newATE.competencia}
                    onChange={(e) =>
                      setNewATE((prev) => ({ ...prev, competencia: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de ATE *</Label>
                  <Select value={newATE.tipo} onValueChange={(value: any) =>
                    setNewATE((prev) => ({ ...prev, tipo: value }))
                  }>
                    <SelectTrigger id="tipo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="producto">Producto</SelectItem>
                      <SelectItem value="proceso">Proceso</SelectItem>
                      <SelectItem value="sistema">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Describe brevemente tu idea..."
                    value={newATE.descripcion}
                    onChange={(e) =>
                      setNewATE((prev) => ({ ...prev, descripcion: e.target.value }))
                    }
                    className="min-h-20"
                  />
                </div>

                <Button
                  onClick={handleCreateATE}
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? "Creando..." : "Crear ATE"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* ATEs List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : ates && ates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ates.map((ate) => (
              <Card key={ate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{ate.nombre}</CardTitle>
                      <CardDescription>{ate.grado && `Grado: ${ate.grado}`}</CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ate.tipo === "producto"
                        ? "bg-blue-100 text-blue-700"
                        : ate.tipo === "proceso"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {ate.tipo}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {ate.descripcion && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {ate.descripcion}
                    </p>
                  )}

                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      Progreso: Fase {ate.ultimaFaseCompletada || 0} de 6
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${((ate.ultimaFaseCompletada || 0) / 6) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => navigate(`/ate/${ate.id}`)}
                    >
                      <ArrowRight className="w-4 h-4" />
                      Continuar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateATE(ate.id, ate.nombre)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteATE(ate.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-lg text-muted-foreground mb-4">
                No tienes ATEs creadas aún
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Crear tu primera ATE
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Actividad Tecnológica Escolar</DialogTitle>
                    <DialogDescription>
                      Completa los datos básicos para comenzar tu ATE
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">Nombre de la ATE *</Label>
                      <Input
                        id="nombre"
                        placeholder="Ej: Sistema de purificación de agua"
                        value={newATE.nombre}
                        onChange={(e) =>
                          setNewATE((prev) => ({ ...prev, nombre: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="grado">Grado</Label>
                      <Input
                        id="grado"
                        placeholder="Ej: 9°, 10°, 11°"
                        value={newATE.grado}
                        onChange={(e) =>
                          setNewATE((prev) => ({ ...prev, grado: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="competencia">Competencia</Label>
                      <Input
                        id="competencia"
                        placeholder="Ej: Pensamiento tecnológico"
                        value={newATE.competencia}
                        onChange={(e) =>
                          setNewATE((prev) => ({ ...prev, competencia: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="tipo">Tipo de ATE *</Label>
                      <Select value={newATE.tipo} onValueChange={(value: any) =>
                        setNewATE((prev) => ({ ...prev, tipo: value }))
                      }>
                        <SelectTrigger id="tipo">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="producto">Producto</SelectItem>
                          <SelectItem value="proceso">Proceso</SelectItem>
                          <SelectItem value="sistema">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        placeholder="Describe brevemente tu idea..."
                        value={newATE.descripcion}
                        onChange={(e) =>
                          setNewATE((prev) => ({ ...prev, descripcion: e.target.value }))
                        }
                        className="min-h-20"
                      />
                    </div>

                    <Button
                      onClick={handleCreateATE}
                      disabled={createMutation.isPending}
                      className="w-full"
                    >
                      {createMutation.isPending ? "Creando..." : "Crear ATE"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
