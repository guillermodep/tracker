'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Search,
  Calendar,
  Target,
  AlertCircle,
} from 'lucide-react';
import { mockProjects, PHASES } from '@/lib/mockData';

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calcular métricas
  const totalProjects = mockProjects.length;
  const criticalProjects = mockProjects.filter(p => p.risk_level === 'CRITICAL').length;
  const warningProjects = mockProjects.filter(p => p.risk_level === 'WARNING').length;
  const healthyProjects = mockProjects.filter(p => p.risk_level === 'HEALTHY').length;
  const completedProjects = mockProjects.filter(p => p.status === 'Production').length;
  const blockedTasks = mockProjects.reduce((sum, p) => sum + p.blocked_tasks, 0);
  const totalTasks = mockProjects.reduce((sum, p) => sum + p.total_tasks, 0);
  const completedTasks = mockProjects.reduce((sum, p) => sum + p.completed_tasks, 0);
  const avgCompletion = Math.round(mockProjects.reduce((sum, p) => sum + p.completion_rate, 0) / totalProjects);
  const avgHealthScore = Math.round(mockProjects.reduce((sum, p) => sum + p.health_score, 0) / totalProjects);

  // Proyectos por fase
  const projectsByPhase = PHASES.map(phase => ({
    name: phase.name,
    count: mockProjects.filter(p => p.status === phase.id).length,
    color: phase.color,
    icon: phase.icon,
  }));

  // Proyectos en riesgo
  const projectsAtRisk = mockProjects
    .filter(p => p.risk_level === 'CRITICAL' || p.risk_level === 'WARNING')
    .sort((a, b) => {
      if (a.risk_level === 'CRITICAL' && b.risk_level !== 'CRITICAL') return -1;
      if (a.risk_level !== 'CRITICAL' && b.risk_level === 'CRITICAL') return 1;
      return a.health_score - b.health_score;
    })
    .slice(0, 5);

  // Próximos vencimientos
  const upcomingDeadlines = mockProjects
    .filter(p => p.status !== 'Production')
    .sort((a, b) => new Date(a.target_end_date).getTime() - new Date(b.target_end_date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Vista general de proyectos de migración cloud
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Calendar size={16} />
              Últimos 30 días
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <BarChart3 size={16} />
              Exportar Reporte
            </button>
          </div>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">Todos los proyectos</option>
            <option value="critical">Críticos</option>
            <option value="warning">En alerta</option>
            <option value="healthy">Saludables</option>
          </select>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="p-6 space-y-6">
        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Proyectos"
            value={totalProjects}
            icon={<Target size={24} />}
            color="blue"
            trend="+2 este mes"
          />
          <KPICard
            title="Proyectos Críticos"
            value={criticalProjects}
            icon={<AlertTriangle size={24} />}
            color="red"
            trend={`${criticalProjects} requieren atención`}
          />
          <KPICard
            title="Completitud Promedio"
            value={`${avgCompletion}%`}
            icon={<TrendingUp size={24} />}
            color="green"
            trend="+5% vs mes anterior"
          />
          <KPICard
            title="Health Score"
            value={`${avgHealthScore}/100`}
            icon={<Activity size={24} />}
            color="purple"
            trend={avgHealthScore >= 70 ? 'Saludable' : 'Requiere atención'}
          />
        </div>

        {/* Gráficos y Métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Distribución por Estado */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Distribución de Riesgo</h3>
              <PieChart size={20} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              <RiskBar label="Saludables" count={healthyProjects} total={totalProjects} color="green" />
              <RiskBar label="En Alerta" count={warningProjects} total={totalProjects} color="orange" />
              <RiskBar label="Críticos" count={criticalProjects} total={totalProjects} color="red" />
            </div>
          </div>

          {/* Tareas Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Tareas</h3>
              <CheckCircle2 size={20} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {completedTasks}/{totalTasks}
                </div>
                <p className="text-sm text-gray-500">Tareas Completadas</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                />
              </div>
              {blockedTasks > 0 && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-red-900">
                      {blockedTasks} tareas bloqueadas
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Proyectos por Fase */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Proyectos por Fase</h3>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {projectsByPhase.map((phase) => (
              <div
                key={phase.name}
                className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-2">{phase.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{phase.count}</div>
                <div className="text-xs text-gray-600">{phase.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Proyectos en Riesgo y Próximos Vencimientos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proyectos en Riesgo */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Proyectos en Riesgo</h3>
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div className="space-y-3">
              {projectsAtRisk.map((project) => (
                <div
                  key={project.id}
                  className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{project.app_name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{project.project_manager}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.risk_level === 'CRITICAL'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {project.risk_level === 'CRITICAL' ? '🔴 Crítico' : '🟡 Alerta'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Health: {project.health_score}/100</span>
                    <span>•</span>
                    <span>{project.completion_rate}% completado</span>
                    {project.blocked_tasks > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-red-600">{project.blocked_tasks} bloqueadas</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Próximos Vencimientos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Próximos Vencimientos</h3>
              <Clock size={20} className="text-blue-500" />
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map((project) => {
                const daysUntil = Math.ceil(
                  (new Date(project.target_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                const isUrgent = daysUntil <= 7;

                return (
                  <div
                    key={project.id}
                    className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{project.app_name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{project.status}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isUrgent ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {daysUntil > 0 ? `${daysUntil} días` : 'Vencido'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar size={12} />
                      <span>
                        {new Date(project.target_end_date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de KPI Card
interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'purple';
  trend: string;
}

function KPICard({ title, value, icon, color, trend }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        <p className="text-xs text-gray-600">{trend}</p>
      </div>
    </div>
  );
}

// Componente de Barra de Riesgo
interface RiskBarProps {
  label: string;
  count: number;
  total: number;
  color: 'green' | 'orange' | 'red';
}

function RiskBar({ label, count, total, color }: RiskBarProps) {
  const percentage = Math.round((count / total) * 100);
  const colorClasses = {
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">
          {count} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className={`${colorClasses[color]} h-3 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
