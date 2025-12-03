'use client';

import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from 'lucide-react';
import { mockProjects, PHASES } from '@/lib/mockData';

export default function InteractiveCharts() {
  // Datos para gráfico de proyectos por fase
  const projectsByPhase = PHASES.map(phase => ({
    name: phase.name.substring(0, 10),
    count: mockProjects.filter(p => p.status === phase.id).length,
    color: phase.color,
  }));

  // Datos para gráfico de riesgo
  const riskData = [
    { name: 'Saludables', value: mockProjects.filter(p => p.risk_level === 'HEALTHY').length, color: '#10b981' },
    { name: 'En Alerta', value: mockProjects.filter(p => p.risk_level === 'WARNING').length, color: '#f59e0b' },
    { name: 'Críticos', value: mockProjects.filter(p => p.risk_level === 'CRITICAL').length, color: '#ef4444' },
  ];

  // Datos para gráfico de progreso
  const progressData = mockProjects.slice(0, 7).map(p => ({
    name: p.app_name.substring(0, 15) + '...',
    completitud: p.completion_rate,
    health: p.health_score,
  }));

  // Datos para gráfico de tendencia (simulado)
  const trendData = [
    { week: 'Sem 1', completed: 12, planned: 15 },
    { week: 'Sem 2', completed: 18, planned: 20 },
    { week: 'Sem 3', completed: 22, planned: 25 },
    { week: 'Sem 4', completed: 28, planned: 30 },
    { week: 'Sem 5', completed: 35, planned: 35 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gráficos Interactivos</h2>
        <p className="text-sm text-gray-500">Análisis visual de datos</p>
      </div>

      {/* Primera fila: Proyectos por Fase y Distribución de Riesgo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proyectos por Fase */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Proyectos por Fase</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectsByPhase}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Riesgo */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={20} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Distribución de Riesgo</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segunda fila: Progreso de Proyectos */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={20} className="text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Progreso y Health Score por Proyecto</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Legend />
            <Bar dataKey="completitud" fill="#10b981" name="Completitud %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="health" fill="#3b82f6" name="Health Score" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tercera fila: Tendencia de Tareas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Tendencia de Tareas Completadas</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#10b981" 
              strokeWidth={3} 
              name="Completadas"
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="planned" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              strokeDasharray="5 5"
              name="Planificadas"
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Velocity Promedio"
          value="3.5"
          unit="tareas/sem"
          trend="+12%"
          trendUp={true}
          color="blue"
        />
        <StatCard
          title="Tiempo Promedio"
          value="45"
          unit="días/proyecto"
          trend="-8%"
          trendUp={true}
          color="green"
        />
        <StatCard
          title="Tasa de Éxito"
          value="87%"
          unit="proyectos"
          trend="+5%"
          trendUp={true}
          color="purple"
        />
        <StatCard
          title="Bloqueos Activos"
          value={mockProjects.reduce((sum, p) => sum + p.blocked_tasks, 0)}
          unit="tareas"
          trend="-15%"
          trendUp={true}
          color="orange"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend: string;
  trendUp: boolean;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ title, value, unit, trend, trendUp, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${colorClasses[color]}`}>
      <p className="text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm">{unit}</p>
      </div>
      <p className={`text-xs font-medium mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trend} vs mes anterior
      </p>
    </div>
  );
}
