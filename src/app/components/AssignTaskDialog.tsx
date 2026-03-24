import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useUsers } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignTask: (userId: string, userName: string) => void;
  taskTitle: string;
}

export function AssignTaskDialog({ open, onOpenChange, onAssignTask, taskTitle }: AssignTaskDialogProps) {
  const users = useUsers();
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error('Por favor selecciona un usuario');
      return;
    }

    const selectedUser = users.find(u => u.id === selectedUserId);
    if (!selectedUser) {
      toast.error('Usuario no encontrado');
      return;
    }

    onAssignTask(selectedUserId, selectedUser.name);
    toast.success(`Tarea asignada a ${selectedUser.name} exitosamente`);
    setSelectedUserId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Asignar Tarea</DialogTitle>
            <DialogDescription>
              {taskTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user">
                Selecciona un usuario <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Selecciona un usuario..." />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.role === 'user').map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedUserId('');
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Asignar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
