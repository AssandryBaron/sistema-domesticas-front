import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
} from './ui/alert-dialog';
import { Users, Trash2, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:8080/api';

interface Miembro {
  id: number;
  name: string;
  email: string;
  rol: string;
  familiaId: number | null;
}

export function MembersPanel() {
  const { user, isAdmin } = useAuth();
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);

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

  // Escenario 1: Cargar lista de miembros desde el backend
  const cargarMiembros = useCallback(async () => {
    if (!user?.familiaId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/hogares/${user.familiaId}/miembros`
      );
      if (response.ok) {
        const data = await response.json();
        setMiembros(data);
      } else {
        toast.error('No se pudo cargar la lista de miembros');
      }
    } catch {
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }, [user?.familiaId]);

  useEffect(() => {
    cargarMiembros();
  }, [cargarMiembros]);

  // Escenario 2 y 3: Eliminar miembro con validación
  const handleEliminar = async (miembroId: number, miembroName: string) => {
    // Escenario 3: Intento de auto-eliminación (validación en front también)
    if (miembroId === Number(user?.id)) {
      toast.error('No puedes eliminarte a ti mismo');
      return;
    }

    setEliminando(miembroId);
    try {
      const response = await fetch(
        `${API_BASE}/hogares/${user?.familiaId}/miembros/${miembroId}?adminId=${user?.id}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        toast.success(`${miembroName} fue eliminado del hogar`);
        // Escenario 5: La lista se actualiza automáticamente
        await cargarMiembros();
      } else {
        const error = await response.json();
        toast.error(error.mensaje || 'No se pudo eliminar al miembro');
      }
    } catch {
      toast.error('Error de conexión con el servidor');
    } finally {
      setEliminando(null);
    }
  };

  const getRolBadge = (rol: string) => {
    const esAdmin = rol === 'ADMINISTRADOR';
    return (
      <Badge
        variant={esAdmin ? 'default' : 'secondary'}
        className={esAdmin ? 'bg-purple-600' : ''}
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          <CardTitle>Gestión de Miembros del Hogar</CardTitle>
        </div>
        <p className="text-sm text-gray-500">
          {miembros.length} miembro{miembros.length !== 1 ? 's' : ''} en el hogar
        </p>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Cargando miembros...
          </div>
        ) : miembros.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>No hay miembros en este hogar todavía.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {miembros.map((miembro) => {
              const esSelf = miembro.id === Number(user?.id);
              return (
                <div
                  key={miembro.id}
                  className="flex items-center justify-between py-3"
                >
                  {/* Info del miembro */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-700 font-semibold text-sm">
                        {miembro.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {miembro.name}
                        {esSelf && (
                          <span className="ml-2 text-xs text-gray-400">(tú)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{miembro.email}</p>
                    </div>
                  </div>

                  {/* Rol + Botón eliminar */}
                  <div className="flex items-center gap-3">
                    {getRolBadge(miembro.rol)}

                    {/* No mostrar botón de eliminar para sí mismo */}
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
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Eliminar a {miembro.name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará a{' '}
                              <strong>{miembro.name}</strong> del hogar. El
                              miembro perderá el acceso de forma inmediata y no
                              podrá ver las tareas del hogar.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
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
  );
}
