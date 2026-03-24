import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useHome } from '../contexts/HomeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Home, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function HomeSetup() {
  const [createData, setCreateData] = useState({ name: '', address: '' });
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { createHome } = useHome();
  const navigate = useNavigate();

  const handleCreateHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!createData.name.trim()) {
      setError('El nombre del hogar es obligatorio');
      toast.error('El nombre del hogar es obligatorio');
      return;
    }

    if (createData.name.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      toast.error('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (!createData.address.trim()) {
      setError('La dirección es obligatoria');
      toast.error('La dirección es obligatoria');
      return;
    }

    if (createData.address.trim().length < 5) {
      setError('La dirección debe tener al menos 5 caracteres');
      toast.error('La dirección debe tener al menos 5 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user ID - en producción vendría del contexto de auth
      createHome(createData.name.trim(), createData.address.trim(), '1');
      
      toast.success('¡Hogar creado exitosamente!');
      navigate('/dashboard');
    } catch (err) {
      setError('Error al crear el hogar');
      toast.error('Error al crear el hogar. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!joinCode.trim()) {
      setError('El código de invitación es obligatorio');
      toast.error('El código de invitación es obligatorio');
      return;
    }

    if (joinCode.trim().length < 6) {
      setError('El código de invitación no es válido');
      toast.error('El código de invitación no es válido');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulación de unirse a un hogar
      // En producción aquí se verificaría el código
      const validCodes = ['ABC12345', 'TEST1234'];
      
      if (validCodes.includes(joinCode.trim().toUpperCase())) {
        toast.success('¡Te has unido al hogar exitosamente!');
        navigate('/dashboard');
      } else {
        setError('Código de invitación inválido o expirado');
        toast.error('Código de invitación inválido o expirado');
      }
    } catch (err) {
      setError('Error al unirse al hogar');
      toast.error('Error al unirse al hogar. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Configura tu Hogar</CardTitle>
          <CardDescription>
            Crea un nuevo hogar o únete a uno existente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Crear Hogar</TabsTrigger>
              <TabsTrigger value="join">Unirse</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <form onSubmit={handleCreateHome} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="homeName">
                    Nombre del hogar <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="homeName"
                    type="text"
                    placeholder="Ej: Casa Familia García"
                    value={createData.name}
                    onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500">
                    Un nombre descriptivo para identificar tu hogar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Dirección <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Ej: Av. Principal 123, Ciudad"
                    value={createData.address}
                    onChange={(e) => setCreateData({ ...createData, address: e.target.value })}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500">
                    La dirección física de tu hogar
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Home className="w-4 h-4 mr-2" />
                  {isLoading ? 'Creando...' : 'Crear Hogar'}
                </Button>

                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-700">
                    💡 Al crear un hogar, serás el administrador y podrás gestionar todas las tareas.
                  </p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="join">
              <form onSubmit={handleJoinHome} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">
                    Código de invitación <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    placeholder="Ej: ABC12345"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    disabled={isLoading}
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500">
                    Ingresa el código que te compartió el administrador
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Users className="w-4 h-4 mr-2" />
                  {isLoading ? 'Uniéndose...' : 'Unirse al Hogar'}
                </Button>

                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-700">
                    💡 Códigos de prueba: ABC12345 o TEST1234
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya configuraste tu hogar?{' '}
              <button
                onClick={() => navigate('/')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Ir al login
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}