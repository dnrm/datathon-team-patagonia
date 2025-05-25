"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Bell,
  DollarSign,
  Tv,
  Home,
  ShoppingCart,
  Gamepad2,
  Plus,
  Settings,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Types for API data
interface ExpenseData {
  tipo: string;
  dia_pago: number;
  promedio_monto: number;
}

interface ApiResponse {
  [key: string]: ExpenseData;
}

interface ProcessedExpense {
  id: number;
  category: string;
  name: string;
  amount: number;
  date: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  reminder: boolean;
}

// Color palette for expenses
const colors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-cyan-500",
  "bg-orange-500", "bg-emerald-500", "bg-violet-500", "bg-rose-500",
  "bg-amber-500", "bg-lime-500", "bg-teal-500", "bg-sky-500"
];

// Function to get random color
const getRandomColor = (index: number) => colors[index % colors.length];

// Function to get icon based on service name
const getIconForService = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  if (name.includes('netflix') || name.includes('max') || name.includes('prime')) return Tv;
  if (name.includes('spotify')) return Tv;
  if (name.includes('oxxo') || name.includes('7 eleven') || name.includes('farmacias')) return ShoppingCart;
  if (name.includes('att') || name.includes('izzi') || name.includes('google')) return Home;
  if (name.includes('amazon')) return ShoppingCart;
  if (name.includes('cinepolis')) return Gamepad2;
  if (name.includes('mercado pago') || name.includes('facebook')) return DollarSign;
  return DollarSign; // Default icon
};

export default function ExpenseCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showReminders, setShowReminders] = useState(true);
  const [expenses, setExpenses] = useState<ProcessedExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses data from API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analizar-gastos-usuarios');
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
        const data: ApiResponse = await response.json();
        
        // Transform API data to ProcessedExpense format
        const processedExpenses: ProcessedExpense[] = Object.entries(data).map(([serviceName, expenseData], index) => ({
          id: index + 1,
          category: getCategoryFromService(serviceName),
          name: serviceName,
          amount: Math.round(expenseData.promedio_monto),
          date: expenseData.dia_pago,
          icon: getIconForService(serviceName),
          color: getRandomColor(index),
          reminder: true // Enable reminders for all API expenses
        }));
        
        setExpenses(processedExpenses);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Function to categorize services
  const getCategoryFromService = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('netflix') || name.includes('max') || name.includes('spotify') || name.includes('prime')) return 'suscripciones';
    if (name.includes('oxxo') || name.includes('7 eleven') || name.includes('farmacias') || name.includes('amazon')) return 'compras';
    if (name.includes('att') || name.includes('izzi') || name.includes('google')) return 'servicios';
    if (name.includes('cinepolis')) return 'entretenimiento';
    if (name.includes('mercado pago') || name.includes('facebook')) return 'pagos';
    return 'otros';
  };

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Obtener días del mes
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Navegar entre meses
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  // Obtener gastos de un día específico
  const getExpensesForDay = (day: number) => {
    return expenses.filter((expense) => expense.date === day);
  };

  // Calcular totales
  const totalFixed = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Gastos variables agrupados por categoría
  const variableExpensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = {
        category: expense.category,
        name: expense.category.charAt(0).toUpperCase() + expense.category.slice(1),
        amount: 0,
        icon: expense.icon,
        color: expense.color,
        description: `Gastos de ${expense.category}`,
        count: 0
      };
    }
    acc[expense.category].amount += expense.amount;
    acc[expense.category].count += 1;
    return acc;
  }, {} as Record<string, {
    category: string;
    name: string;
    amount: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
    count: number;
  }>);
  
  const variableExpenses = Object.values(variableExpensesByCategory);
  const totalVariable = variableExpenses.reduce((sum: number, expense: { amount: number }) => sum + expense.amount, 0);
  const totalMonthly = totalFixed + totalVariable;

  // Generar días del calendario
  const calendarDays = [];

  // Días vacíos al inicio
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 mt-8 mb-12">
            <h1 className="text-4xl font-black text-gray-800">
              Calendario de
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gastos Predictivos
              </span>
            </h1>
            <p className="text-gray-600">
              Planifica y controla tus gastos mensuales
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando gastos...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Error: {error}
              </div>
            </div>
          )}

          {/* Main Content */}
          {!loading && !error && (
            <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendario Principal */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth("prev")}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {months[currentMonth]} {currentYear}
                      </h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth("next")}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Recordatorios
                      </span>
                      <Switch
                        checked={showReminders}
                        onCheckedChange={setShowReminders}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Días de la semana */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Días del calendario */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) => {
                      if (!day) {
                        return <div key={index} className="h-20" />;
                      }

                      const dayExpenses = getExpensesForDay(day);
                      const isSelected = selectedDay === day;
                      const isToday =
                        day === new Date().getDate() &&
                        currentMonth === new Date().getMonth() &&
                        currentYear === new Date().getFullYear();

                      return (
                        <div
                          key={index}
                          className={`
                          h-20 border rounded-lg p-1 cursor-pointer transition-all duration-200
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }
                          ${isToday ? "bg-blue-100 border-blue-300" : ""}
                        `}
                          onClick={() => setSelectedDay(day)}
                        >
                          <div className="flex flex-col h-full">
                            <span
                              className={`text-sm font-medium ${
                                isToday ? "text-blue-600" : "text-gray-700"
                              }`}
                            >
                              {day}
                            </span>
                            <div className="flex-1 space-y-1">
                              {dayExpenses.slice(0, 2).map((expense) => (
                                <div
                                  key={expense.id}
                                  className={`text-xs px-1 py-0.5 rounded text-white ${expense.color} truncate`}
                                >
                                  ${expense.amount}
                                </div>
                              ))}
                              {dayExpenses.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{dayExpenses.length - 2} más
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Gastos Variables */}
              <Card className="shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Gastos Variables (Promedio Mensual)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {variableExpenses.map((expense) => {
                      const Icon = expense.icon;
                      return (
                        <div
                          key={expense.category}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg ${expense.color}`}
                              >
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  {expense.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {expense.description}
                                </p>
                              </div>
                            </div>
                            <span className="text-lg font-bold text-gray-800">
                              ${expense.amount.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={(expense.amount / 3200) * 100}
                            className="h-2"
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel Lateral */}
            <div className="space-y-6">
              {/* Resumen del Día Seleccionado */}
              {selectedDay && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedDay} de {months[currentMonth]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getExpensesForDay(selectedDay).map((expense) => {
                        const Icon = expense.icon;
                        return (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg ${expense.color}`}
                              >
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {expense.name}
                                </h4>
                                <p className="text-xs text-gray-500 capitalize">
                                  {expense.category}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-gray-800">
                                ${expense.amount}
                              </span>
                              {expense.reminder && showReminders && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <Bell className="h-3 w-3 text-orange-500" />
                                  <span className="text-xs text-orange-500">
                                    Recordatorio
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {getExpensesForDay(selectedDay).length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          No hay gastos programados para este día
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Resumen Mensual */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span>Resumen Mensual</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">
                        Gastos Fijos
                      </span>
                      <span className="font-bold text-blue-800">
                        ${totalFixed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">
                        Gastos Variables
                      </span>
                      <span className="font-bold text-green-800">
                        ${totalVariable.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                      <span className="font-semibold text-gray-800">
                        Total Mensual
                      </span>
                      <span className="text-xl font-black text-gray-800">
                        ${totalMonthly.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Distribución
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Gastos Fijos</span>
                        <span>
                          {((totalFixed / totalMonthly) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={(totalFixed / totalMonthly) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span>Gastos Variables</span>
                        <span>
                          {((totalVariable / totalMonthly) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={(totalVariable / totalMonthly) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Próximos Pagos */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <span>Próximos Pagos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expenses
                      .filter((expense) => {
                        const today = new Date().getDate();
                        const daysUntil = expense.date - today;
                        return expense.reminder && daysUntil >= 0 && daysUntil <= 7;
                      })
                      .sort((a, b) => a.date - b.date)
                      .slice(0, 4)
                      .map((expense) => {
                        const Icon = expense.icon;
                        const daysUntil = expense.date - new Date().getDate();
                        const isOverdue = daysUntil < 0;
                        const isToday = daysUntil === 0;
                        const isUpcoming = daysUntil > 0 && daysUntil <= 3;

                        return (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg ${expense.color}`}
                              >
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {expense.name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {expense.date} de {months[currentMonth]}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-gray-800">
                                ${expense.amount}
                              </span>
                              {isOverdue && (
                                <Badge
                                  variant="destructive"
                                  className="ml-2 text-xs"
                                >
                                  Vencido
                                </Badge>
                              )}
                              {isToday && (
                                <Badge className="ml-2 text-xs bg-orange-500">
                                  Hoy
                                </Badge>
                              )}
                              {isUpcoming && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  {daysUntil} días
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              {/* Acciones Rápidas */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span>Acciones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Gasto Fijo
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Configurar Recordatorios
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Exportar Calendario
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
