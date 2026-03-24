import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Home, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido');
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-type':'Application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      if (response.ok) {
        // 1. Obtenemos los datos de Java
        const usuarioEncontrado = await response.json();

        // 2. IMPORTANTE: Usamos la función login del Contexto para que toda la App se entere
        // Esto "llena" la pizarra global con los datos de Cristian
        await login(email, password);

        toast.success('¡Bienvenido! Inicio de sesión exitoso');

        // 3. Redirigimos según lo que Java nos diga
        if (!usuarioEncontrado.familiaId) {
          navigate('/home-setup');
        } else {
          navigate('/dashboard'); // DashboardRouter en routes.tsx se encargará del resto
        }
      } else {
        setError('Credenciales incorrectas');
        toast.error('Credenciales incorrectas. Por favor intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
      toast.error('Error al iniciar sesión. Por favor intenta nuevamente.');
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
          <CardTitle className="text-2xl">Gestión de Tareas</CardTitle>
          <CardDescription>
            Sistema de tareas domésticas compartidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Regístrate
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md space-y-2">
            <p className="text-sm font-medium text-blue-900">Usuarios de prueba:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <p>🔑 Admin: admin@casa.com</p>
              <p>👤 Usuario: carlos@casa.com</p>
              <p className="text-blue-600 mt-2">Contraseña: cualquiera</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}