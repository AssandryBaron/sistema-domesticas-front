import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useUsers } from "../contexts/AuthContext";
import { toast } from "sonner";

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignTask: (userId: string, userName: string) => void;
  taskTitle: string;
}

export function AssignTaskDialog({
  open,
  onOpenChange,
  onAssignTask,
  taskTitle,
}: AssignTaskDialogProps) {
  const rawUsers = useUsers();
  const [selectedUserId, setSelectedUserId] = useState("");

  // BLINDAJE: Si 'rawUsers' no es un arreglo válido, forzamos uno vacío para evitar colapsos.
  const usersList = Array.isArray(rawUsers) ? rawUsers : [];

  // FILTRO ADAPTADO: Normalizamos el rol a mayúsculas para que coincida perfectamente con 'ADMINISTRADOR' y 'MIEMBRO' de tu BD.
  const filteredUsers = usersList.filter((u) => {
    if (!u) return false;
    const role = ((u as any).role || "").toUpperCase();
    return (
      role === "MIEMBRO" ||
      role === "ADMINISTRADOR" ||
      role === "USER" ||
      role === ""
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error("Por favor selecciona un usuario");
      return;
    }

    const selectedUser = filteredUsers.find(
      (u) => (u as any).id?.toString() === selectedUserId.toString(),
    ) as any;

    if (!selectedUser) {
      toast.error("Usuario no encontrado");
      return;
    }

    onAssignTask(selectedUserId, selectedUser.name || "Usuario");
    toast.success(
      `Tarea asignada a ${selectedUser.name || "Usuario"} exitosamente`,
    );
    setSelectedUserId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Asignar Tarea
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {taskTitle || "Sin título"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user" className="font-medium">
                Selecciona un usuario <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user" className="w-full">
                  <SelectValue
                    placeholder={
                      filteredUsers.length === 0
                        ? "No hay miembros disponibles"
                        : "Selecciona un usuario..."
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {filteredUsers.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      No se encontraron miembros en este hogar
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <SelectItem
                        key={(user as any).id}
                        value={(user as any).id?.toString() || ""}
                      >
                        {(user as any).name || "Sin nombre"}{" "}
                        {(user as any).email ? `(${(user as any).email})` : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedUserId("");
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
            >
              Asignar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
