import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Home, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación de nombre
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio');
      toast.error('El nombre es obligatorio');
      return;
    }

    if (formData.name.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      toast.error('El nombre debe tener al menos 3 caracteres');
      return;
    }

    // Validación de email
    if (!formData.email) {
      setError('El email es obligatorio');
      toast.error('El email es obligatorio');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Por favor ingresa un email válido');
      toast.error('Por favor ingresa un email válido');
      return;
    }

    // Validación de contraseña
    if (!formData.password) {
      setError('La contraseña es obligatoria');
      toast.error('La contraseña es obligatoria');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validación de confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:8080/api/usuarios/registro', {   //Desde el react se envia peticion a la url mencionada
        method: 'POST', // Se especifica el metodo, el tipo de contenido y el cuerpo de la peticion POST.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ //Convierte el string (diccionario?) en texto plano formato (JSON).
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) { //Si la respuesta no fue exitosa, salta al catch
        throw new Error(' Error en el servidor al registrar');
      }

      const data = await response.json(); // Se convierte la respuesta del servidor nuevamente en diccionario
      console.log('Usuario registrado:', data); //Se imprime que se registro el usuario en consola

      toast.success('¡Cuenta creada exitosamente! Bienvenido ' + data.name); //Se notifica en pantalla que se registro correctamente
      navigate('/home-setup'); //Se redirige a otra url.

    } catch (err) { // Si sale error
      setError('Error al conectar con el servidor');
      toast.error('No se pudo conectar con el backend. ¿Está encendido IntelliJ?');
    } finally {
      setIsLoading(false); //Al final debe dejar de cargar, sea que se procese exitosamente o que se termine de procesar sin exito
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate para gestionar las tareas de tu hogar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Contraseña <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmar contraseña <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => navigate('/')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
