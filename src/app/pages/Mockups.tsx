import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Home, 
  AlertCircle, 
  LogOut, 
  Plus, 
  Calendar, 
  User, 
  Trash2, 
  UserPlus, 
  CheckCircle2, 
  Clock,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Mockups() {
  const [selectedView, setSelectedView] = useState<'login' | 'register' | 'home-setup' | 'user' | 'admin' | 'dialogs' | 'calendar' | 'reports'>('login');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Mockups - Sistema de Tareas Domésticas</CardTitle>
            <CardDescription>Selecciona una vista para ver el diseño</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedView === 'login' ? 'default' : 'outline'}
                onClick={() => setSelectedView('login')}
              >
                Login
              </Button>
              <Button 
                variant={selectedView === 'register' ? 'default' : 'outline'}
                onClick={() => setSelectedView('register')}
              >
                Registro
              </Button>
              <Button 
                variant={selectedView === 'home-setup' ? 'default' : 'outline'}
                onClick={() => setSelectedView('home-setup')}
              >
                Crear/Unirse Hogar
              </Button>
              <Button 
                variant={selectedView === 'user' ? 'default' : 'outline'}
                onClick={() => setSelectedView('user')}
              >
                Vista Usuario
              </Button>
              <Button 
                variant={selectedView === 'admin' ? 'default' : 'outline'}
                onClick={() => setSelectedView('admin')}
              >
                Vista Administrador
              </Button>
              <Button 
                variant={selectedView === 'calendar' ? 'default' : 'outline'}
                onClick={() => setSelectedView('calendar')}
              >
                Calendario
              </Button>
              <Button 
                variant={selectedView === 'dialogs' ? 'default' : 'outline'}
                onClick={() => setSelectedView('dialogs')}
              >
                Diálogos
              </Button>
              <Button 
                variant={selectedView === 'reports' ? 'default' : 'outline'}
                onClick={() => setSelectedView('reports')}
              >
                Reportes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        {selectedView === 'calendar' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Calendario de Tareas</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Hoy
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[140px] text-center">
                    Marzo 2026
                  </span>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Days header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Week 1 */}
                  {[null, null, null, null, null, null, 1].map((day, i) => (
                    <div
                      key={i}
                      className={`min-h-[100px] p-2 border rounded-md ${day ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      {day && <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>}
                    </div>
                  ))}

                  {/* Week 2 */}
                  {[2, 3, 4, 5, 6, 7, 8].map(day => (
                    <div key={day} className="min-h-[100px] p-2 border rounded-md bg-white">
                      <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                    </div>
                  ))}

                  {/* Week 3 */}
                  {[9, 10, 11, 12, 13, 14, 15].map(day => (
                    <div key={day} className="min-h-[100px] p-2 border rounded-md bg-white">
                      <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                      {day === 15 && (
                        <div className="space-y-1">
                          <div className="text-xs p-1 rounded truncate bg-red-100 text-red-800">
                            Limpiar cocina
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Week 4 - Current week */}
                  {[16, 17, 18, 19, 20, 21, 22].map(day => (
                    <div
                      key={day}
                      className={`min-h-[100px] p-2 border rounded-md ${
                        day === 16 ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${day === 16 ? 'text-indigo-700' : 'text-gray-900'}`}>
                        {day}
                      </div>
                      {day === 17 && (
                        <div className="space-y-1">
                          <div className="text-xs p-1 rounded truncate bg-yellow-100 text-yellow-800">
                            Sacar basura
                          </div>
                        </div>
                      )}
                      {day === 18 && (
                        <div className="space-y-1">
                          <div className="text-xs p-1 rounded truncate bg-red-100 text-red-800">
                            Limpiar cocina
                          </div>
                          <div className="text-xs p-1 rounded truncate bg-yellow-100 text-yellow-800">
                            Ordenar sala
                          </div>
                        </div>
                      )}
                      {day === 20 && (
                        <div className="space-y-1">
                          <div className="text-xs p-1 rounded truncate bg-blue-100 text-blue-800">
                            Aspirar alfombras
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Week 5 */}
                  {[23, 24, 25, 26, 27, 28, 29].map(day => (
                    <div key={day} className="min-h-[100px] p-2 border rounded-md bg-white">
                      <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                    </div>
                  ))}

                  {/* Week 6 */}
                  {[30, 31, null, null, null, null, null].map((day, i) => (
                    <div
                      key={i}
                      className={`min-h-[100px] p-2 border rounded-md ${day ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      {day && <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 pt-4 border-t mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-100"></div>
                    <span className="text-xs text-gray-600">Alta prioridad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-100"></div>
                    <span className="text-xs text-gray-600">Media prioridad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-100"></div>
                    <span className="text-xs text-gray-600">Baja prioridad</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login View */}
        {selectedView === 'login' && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <Card>
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
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        defaultValue=""
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>

                    <Button type="button" className="w-full">
                      Iniciar sesión
                    </Button>
                  </form>

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
          </div>
        )}

        {/* Register View */}
        {selectedView === 'register' && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <Card>
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
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        defaultValue=""
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>

                    <Button type="button" className="w-full">
                      Registrarse
                    </Button>
                  </form>

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
          </div>
        )}

        {/* Home Setup View */}
        {selectedView === 'home-setup' && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <Card>
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
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="homeName">Nombre del Hogar</Label>
                      <Input
                        id="homeName"
                        type="text"
                        placeholder="Mi Hogar"
                        defaultValue=""
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        defaultValue=""
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>

                    <Button type="button" className="w-full">
                      Crear Hogar
                    </Button>
                  </form>

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
          </div>
        )}

        {/* User Dashboard View */}
        {selectedView === 'user' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
                  <p className="text-sm text-gray-600">Bienvenido, Carlos Rodríguez</p>
                </div>
                <Button variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
            </div>

            {/* Tasks */}
            <div className="space-y-6">
              {/* Pending */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">Pendientes</h2>
                  <Badge variant="secondary">1</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">Limpiar la cocina</CardTitle>
                        <Badge className="bg-red-100 text-red-800">Alta</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">Limpiar mesadas, lavar platos y barrer el piso</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>18/03/2026</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Carlos Rodríguez</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-100 text-gray-800">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          Iniciar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* In Progress */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">En Proceso</h2>
                  <Badge variant="secondary">1</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">Ordenar sala de estar</CardTitle>
                        <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">Recoger objetos, acomodar cojines y aspirar</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>17/03/2026</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Carlos Rodríguez</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            En Proceso
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm">
                          Completar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard View */}
        {selectedView === 'admin' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                  <p className="text-sm text-gray-600">Bienvenido, Ana García</p>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Tarea
                  </Button>
                  <Button variant="outline">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tareas</CardTitle>
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sin Asignar</CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">Todas (4)</TabsTrigger>
                <TabsTrigger value="unassigned">Sin Asignar (1)</TabsTrigger>
                <TabsTrigger value="pending">Pendientes (1)</TabsTrigger>
                <TabsTrigger value="in-progress">En Proceso (1)</TabsTrigger>
                <TabsTrigger value="completed">Completadas (1)</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Task 1 - Assigned */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">Limpiar la cocina</CardTitle>
                        <Badge className="bg-red-100 text-red-800">Alta</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">Limpiar mesadas, lavar platos y barrer el piso</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>18/03/2026</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Carlos Rodríguez</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-100 text-gray-800">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task 2 - Unassigned */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">Aspirar alfombras</CardTitle>
                        <Badge className="bg-blue-100 text-blue-800">Baja</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">Aspirar todas las alfombras de la sala y dormitorios</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>20/03/2026</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-100 text-gray-800">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          <UserPlus className="w-4 h-4 mr-1" />
                          Asignar
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task 3 - In Progress */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">Sacar la basura</CardTitle>
                        <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">Sacar todas las bolsas de basura y reciclaje</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>17/03/2026</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>María López</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            En Proceso
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task 4 - Completed */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">Limpiar baño</CardTitle>
                        <Badge className="bg-red-100 text-red-800">Alta</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">Limpiar inodoro, lavabo y ducha</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>16/03/2026</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Juan Martínez</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completada
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Dialogs View */}
        {selectedView === 'dialogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Task Dialog */}
            <Card>
              <CardHeader>
                <CardTitle>Crear Nueva Tarea</CardTitle>
                <CardDescription>Completa los detalles de la tarea doméstica</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Título <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Ej: Limpiar la cocina"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Descripción <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe los detalles de la tarea..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">
                      Prioridad <span className="text-red-500">*</span>
                    </Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">
                      Fecha de vencimiento <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="button" className="flex-1">
                      Crear Tarea
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Assign Task Dialog */}
            <Card>
              <CardHeader>
                <CardTitle>Asignar Tarea</CardTitle>
                <CardDescription>Limpiar la cocina</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">
                      Selecciona un usuario <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger id="user">
                        <SelectValue placeholder="Selecciona un usuario..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Carlos Rodríguez (carlos@casa.com)</SelectItem>
                        <SelectItem value="3">María López (maria@casa.com)</SelectItem>
                        <SelectItem value="4">Juan Martínez (juan@casa.com)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="button" className="flex-1">
                      Asignar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Validation Messages Examples */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Mensajes de Validación y Error</CardTitle>
                <CardDescription>Ejemplos de notificaciones del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Success messages */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">¡Tarea creada exitosamente!</span>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">Tarea asignada a Carlos Rodríguez exitosamente</span>
                  </div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">¡Bienvenido! Inicio de sesión exitoso</span>
                  </div>
                </div>

                {/* Error messages */}
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800 font-medium">El título es obligatorio</span>
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800 font-medium">La descripción debe tener al menos 10 caracteres</span>
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800 font-medium">La fecha de vencimiento no puede ser en el pasado</span>
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800 font-medium">Credenciales incorrectas. Por favor intenta nuevamente.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports View */}
        {selectedView === 'reports' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
                  <p className="text-sm text-gray-600">Bienvenido, Ana García</p>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Tarea
                  </Button>
                  <Button variant="outline">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tareas</CardTitle>
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sin Asignar</CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">Todas (4)</TabsTrigger>
                <TabsTrigger value="unassigned">Sin Asignar (1)</TabsTrigger>
                <TabsTrigger value="pending">Pendientes (1)</TabsTrigger>
                <TabsTrigger value="in-progress">En Proceso (1)</TabsTrigger>
                <TabsTrigger value="completed">Completadas (1)</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Task 1 - Assigned */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">Limpiar la cocina</CardTitle>
                        <Badge className="bg-red-100 text-red-800">Alta</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">Limpiar mesadas, lavar platos y barrer el piso</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>18/03/2026</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Carlos Rodríguez</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-100 text-gray-800">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task 2 - Unassigned */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">Aspirar alfombras</CardTitle>
                        <Badge className="bg-blue-100 text-blue-800">Baja</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">Aspirar todas las alfombras de la sala y dormitorios</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>20/03/2026</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-100 text-gray-800">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          <UserPlus className="w-4 h-4 mr-1" />
                          Asignar
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task 3 - In Progress */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">Sacar la basura</CardTitle>
                        <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">Sacar todas las bolsas de basura y reciclaje</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>17/03/2026</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>María López</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            En Proceso
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task 4 - Completed */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">Limpiar baño</CardTitle>
                        <Badge className="bg-red-100 text-red-800">Alta</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">Limpiar inodoro, lavabo y ducha</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>16/03/2026</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Juan Martínez</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completada
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}