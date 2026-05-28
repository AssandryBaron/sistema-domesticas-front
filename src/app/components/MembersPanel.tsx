import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext"; // HU-14: Importamos el hook de tareas
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Users,
  Trash2,
  ShieldCheck,
  User,
  History,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:8080/api";

interface Miembro {
  id: number;
  name: string;
  email: string;
  rol: string;
  familiaId: number | null;
}

export function MembersPanel() {
  const { user, isAdmin } = useAuth();
  const {
    historyTasks,
    isLoading: loadingHistorial,
    refreshHistory,
  } = useTasks(); // HU-14: Contexto conectado
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);

  // Obtención segura del ID del hogar usando ambas propiedades por compatibilidad
  const hogarId = user?.familiaId || (user as any)?.hogarId;

  // Escenario 1: Cargar lista de miembros desde el backend
  const cargarMiembros = useCallback(async () => {
    if (!hogarId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/hogares/${hogarId}/miembros`);
      if (response.ok) {
        const data = await response.json();
        // BLINDAJE: Nos aseguramos de que siempre se asigne un arreglo válido
        setMiembros(Array.isArray(data) ? data : []);
      } else {
        toast.error("No se pudo cargar la lista de miembros");
        setMiembros([]);
      }
    } catch (error) {
      console.error("Error cargando miembros:", error);
      toast.error("Error de conexión con el servidor");
      setMiembros([]);
    } finally {
      setLoading(false);
    }
  }, [hogarId]);

  // CORRECCIÓN EFECTIVA: Separamos las cargas para evitar re-renders infinitos.
  // 1. Cargar miembros cuando el hogarId esté listo
  useEffect(() => {
    if (hogarId) {
      cargarMiembros();
    }
  }, [hogarId, cargarMiembros]);

  // 2. Sincronizar el historial una sola vez cuando se monta el panel
  useEffect(() => {
    refreshHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escenario 4: Acceso denegado a Miembro
  if (!isAdmin) {
    return (
      <Card className="col-span-full">
        <CardContent className="py-16 text-center">
          <ShieldCheck className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Acceso denegado</p>
          <p className="text-sm text-gray-500 mt-1">
            Solo el administrador del hogar puede gestionar los miembros.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Escenario 2 y 3: Eliminar miembro con validación
  const handleEliminar = async (miembroId: number, miembroName: string) => {
    if (miembroId === Number(user?.id)) {
      toast.error("No puedes eliminarte a ti mismo");
      return;
    }

    setEliminando(miembroId);
    try {
      const response = await fetch(
        `${API_BASE}/hogares/${hogarId}/miembros/${miembroId}?adminId=${user?.id}`,
        { method: "DELETE" },
      );

      if (response.ok) {
        toast.success(`${miembroName} fue eliminado del hogar`);
        await cargarMiembros();
      } else {
        const error = await response.json();
        toast.error(error.mensaje || "No se pudo eliminar al miembro");
      }
    } catch {
      toast.error("Error de conexión con el servidor");
    } finally {
      setEliminando(null);
    }
  };

  const getRolBadge = (rol: string) => {
    const esAdmin = (rol || "").toUpperCase() === "ADMINISTRADOR";
    return (
      <Badge
        variant={esAdmin ? "default" : "secondary"}
        className={esAdmin ? "bg-purple-600" : ""}
      >
        {esAdmin ? (
          <>
            <ShieldCheck className="w-3 h-3 mr-1" />
            Administrador
          </>
        ) : (
          <>
            <User className="w-3 h-3 mr-1" />
            Miembro
          </>
        )}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const listaMiembrosValida = Array.isArray(miembros) ? miembros : [];
  const listaHistorialValida = Array.isArray(historyTasks) ? historyTasks : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* SECCIÓN IZQUIERDA: GESTIÓN DE MIEMBROS */}
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <CardTitle>Gestión de Miembros del Hogar</CardTitle>
          </div>
          <p className="text-sm text-gray-500">
            {listaMiembrosValida.length} miembro
            {listaMiembrosValida.length !== 1 ? "s" : ""} en el hogar
          </p>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Cargando miembros...
            </div>
          ) : listaMiembrosValida.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>No hay miembros en este hogar todavía.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {listaMiembrosValida.map((miembro) => {
                if (!miembro) return null;
                const esSelf = miembro.id === Number(user?.id);
                return (
                  <div
                    key={miembro.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-700 font-semibold text-sm">
                          {(miembro.name || "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {miembro.name || "Sin nombre"}
                          {esSelf && (
                            <span className="ml-2 text-xs text-gray-400">
                              (tú)
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {miembro.email || ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getRolBadge(miembro.rol)}

                      {!esSelf && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              disabled={eliminando === miembro.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Eliminar a {miembro.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará a{" "}
                                <strong>{miembro.name}</strong> del hogar. El
                                miembro perderá el acceso de forma inmediata y
                                no podrá ver las tareas del hogar.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() =>
                                  handleEliminar(miembro.id, miembro.name)
                                }
                              >
                                Sí, eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECCIÓN DERECHA (HU-14): HISTORIAL DE TAREAS COMPLETADAS */}
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-green-600" />
            <CardTitle>Historial de Tareas Completadas</CardTitle>
          </div>
          <p className="text-sm text-gray-500">
            Registro total de tareas cerradas con éxito en el sistema
          </p>
        </CardHeader>

        <CardContent>
          {loadingHistorial ? (
            <div className="py-12 text-center text-gray-500">
              Cargando historial...
            </div>
          ) : listaHistorialValida.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-600">
                No hay tareas completadas todavía
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Las tareas que marques como completadas aparecerán listadas
                aquí.
              </p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar divide-y divide-gray-100">
              {listaHistorialValida.map((tarea) => {
                if (!tarea) return null;
                return (
                  <div
                    key={tarea.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-800 line-clamp-1">
                        {tarea.title}
                      </span>
                      {tarea.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 max-w-md">
                          {tarea.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-gray-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Límite: {tarea.dueDate || "Sin fecha"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 font-bold ${getPriorityColor(tarea.priority)}`}
                      >
                        {tarea.priority === "HIGH"
                          ? "ALTA"
                          : tarea.priority === "MEDIUM"
                            ? "MEDIA"
                            : "BAJA"}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 border-green-200 pointer-events-none text-[10px]">
                        COMPLETADA
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
