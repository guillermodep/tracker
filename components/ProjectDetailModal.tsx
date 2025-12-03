'use client';

import React, { useState } from 'react';
import { X, TrendingUp, FileText, CheckCircle2, AlertTriangle, Clock, User, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { Project, mockPhases, mockTasks } from '@/lib/mockData';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header del Modal */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {project.app_name}
            </h2>
            <p className="text-sm text-gray-600">{project.description}</p>
            
            {/* Badges de Estado */}
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {project.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                project.risk_level === 'WARNING' ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}>
                {project.risk_level}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            {['overview', 'tasks', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <ProjectOverview project={project} />
          )}
          {activeTab === 'tasks' && (
            <ProjectTasks projectId={project.id} />
          )}
          {activeTab === 'timeline' && (
            <ProjectTimeline project={project} />
          )}
        </div>
      </div>
    </div>
  );
}

// Vista de Overview del Proyecto
function ProjectOverview({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Completitud"
          value={`${project.completion_rate}%`}
          icon={<TrendingUp />}
          color="blue"
        />
        <MetricCard
          title="Tareas Totales"
          value={project.total_tasks.toString()}
          icon={<FileText />}
          color="gray"
        />
        <MetricCard
          title="Completadas"
          value={project.completed_tasks.toString()}
          icon={<CheckCircle2 />}
          color="green"
        />
        <MetricCard
          title="Bloqueadas"
          value={project.blocked_tasks.toString()}
          icon={<AlertTriangle />}
          color="red"
        />
      </div>

      {/* Información del Proyecto */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Información del Proyecto</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Project Manager</p>
            <p className="text-base font-medium text-gray-900">{project.project_manager}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha Objetivo</p>
            <p className="text-base font-medium text-gray-900">
              {new Date(project.target_end_date).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Health Score</p>
            <p className="text-base font-medium text-gray-900">{project.health_score}/100</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado Actual</p>
            <p className="text-base font-medium text-gray-900">{project.status}</p>
          </div>
        </div>
      </div>

      {/* Progreso por Fase */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Progreso por Fase</h3>
        <div className="space-y-4">
          {mockPhases.map((phase) => {
            const totalTasks = phase.tasks.length;
            const completedTasks = phase.tasks.filter(t => t.status === 'Done').length;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return (
              <div key={phase.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{phase.name}</span>
                  <span className="text-sm text-gray-500">{completedTasks}/{totalTasks}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Componente de Tarjeta de Métrica
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'gray' | 'green' | 'red';
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    gray: 'bg-gray-50 text-gray-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Componente de Lista de Tareas
function ProjectTasks({ projectId }: { projectId: string }) {
  // Por ahora mostramos todas las tareas mockeadas
  // En producción filtrarías por projectId
  const tasks = mockTasks;

  const getStatusBadge = (status: string) => {
    const badges = {
      'Done': { color: 'bg-green-100 text-green-700 border-green-200', label: 'Completada' },
      'In Progress': { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'En Progreso' },
      'Blocked': { color: 'bg-red-100 text-red-700 border-red-200', label: 'Bloqueada' },
      'Pending': { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Pendiente' },
    };
    return badges[status as keyof typeof badges] || badges['Pending'];
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      'Overdue': 'text-red-600',
      'Risk': 'text-orange-600',
      'On Track': 'text-green-600',
      'Blocked': 'text-red-600',
      'Done': 'text-gray-400',
    };
    return colors[urgency as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Lista de Tareas ({tasks.length})
        </h3>
      </div>

      {/* Lista de Tareas */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const statusBadge = getStatusBadge(task.status);
          const urgencyColor = getUrgencyColor(task.urgency_status);

          return (
            <div
              key={task.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Header de la Tarea */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    {task.is_blocker && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                        Bloqueante
                      </span>
                    )}
                    {task.is_deliverable && (
                      <FileText size={14} className="text-blue-600" />
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}
                </div>
                
                {/* Badge de Estado */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
              </div>

              {/* Detalles de la Tarea */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                {/* Responsable */}
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Responsable</p>
                    <p className="text-sm font-medium text-gray-900">{task.assigned_entity_name}</p>
                  </div>
                </div>

                {/* Fecha Límite */}
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Fecha Límite</p>
                    <p className={`text-sm font-medium ${urgencyColor}`}>
                      {new Date(task.planned_end_date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Estado de Urgencia */}
                <div className="flex items-center gap-2">
                  <AlertCircleIcon size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Urgencia</p>
                    <p className={`text-sm font-medium ${urgencyColor}`}>
                      {task.urgency_status === 'On Track' && '✓ A tiempo'}
                      {task.urgency_status === 'Risk' && '⚠️ En riesgo'}
                      {task.urgency_status === 'Overdue' && '🔴 Vencida'}
                      {task.urgency_status === 'Blocked' && '🛑 Bloqueada'}
                      {task.urgency_status === 'Done' && '✅ Completada'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información de Bloqueo si aplica */}
              {task.status === 'Blocked' && task.responsible_person_name && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircleIcon size={16} className="text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Tarea Bloqueada</p>
                      <p className="text-xs text-red-700 mt-1">
                        Responsable del bloqueo: <span className="font-semibold">{task.responsible_person_name}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No hay tareas registradas para este proyecto</p>
        </div>
      )}
    </div>
  );
}

// Componente de Timeline del Proyecto
function ProjectTimeline({ project }: { project: Project }) {
  // Generar eventos del timeline basados en el proyecto
  const timelineEvents = [
    {
      id: '1',
      date: '2024-12-01',
      type: 'created',
      title: 'Proyecto Creado',
      description: `Proyecto "${project.app_name}" iniciado`,
      icon: '🚀',
      color: 'blue',
    },
    {
      id: '2',
      date: '2024-12-15',
      type: 'phase_change',
      title: `Fase: ${project.status}`,
      description: `El proyecto avanzó a la fase de ${project.status}`,
      icon: '📊',
      color: 'purple',
    },
    {
      id: '3',
      date: '2025-01-05',
      type: 'milestone',
      title: `${project.completion_rate}% Completado`,
      description: `${project.completed_tasks} de ${project.total_tasks} tareas completadas`,
      icon: '✅',
      color: 'green',
    },
  ];

  // Agregar evento de bloqueo si hay tareas bloqueadas
  if (project.blocked_tasks > 0) {
    timelineEvents.push({
      id: '4',
      date: '2025-01-10',
      type: 'blocked',
      title: 'Tareas Bloqueadas',
      description: `${project.blocked_tasks} tareas están bloqueadas y requieren atención`,
      icon: '🛑',
      color: 'red',
    });
  }

  // Agregar evento de riesgo si aplica
  if (project.risk_level === 'CRITICAL' || project.risk_level === 'WARNING') {
    timelineEvents.push({
      id: '5',
      date: '2025-01-12',
      type: 'risk',
      title: `Alerta: Nivel de Riesgo ${project.risk_level}`,
      description: `Health Score: ${project.health_score}/100. Se requiere atención inmediata.`,
      icon: project.risk_level === 'CRITICAL' ? '🔴' : '🟡',
      color: project.risk_level === 'CRITICAL' ? 'red' : 'orange',
    });
  }

  // Agregar fecha objetivo
  timelineEvents.push({
    id: '6',
    date: project.target_end_date,
    type: 'target',
    title: 'Fecha Objetivo',
    description: 'Fecha estimada de finalización del proyecto',
    icon: '🎯',
    color: 'indigo',
  });

  // Ordenar eventos por fecha
  const sortedEvents = [...timelineEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      red: 'bg-red-100 text-red-700 border-red-300',
      orange: 'bg-orange-100 text-orange-700 border-orange-300',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getLineColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-300',
      purple: 'bg-purple-300',
      green: 'bg-green-300',
      red: 'bg-red-300',
      orange: 'bg-orange-300',
      indigo: 'bg-indigo-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Timeline del Proyecto</h3>
          <p className="text-sm text-gray-500 mt-1">Historial de eventos y milestones</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {sortedEvents.map((event, index) => {
          const isLast = index === sortedEvents.length - 1;
          const colorClasses = getColorClasses(event.color);
          const lineColor = getLineColor(event.color);

          return (
            <div key={event.id} className="relative pb-8">
              {/* Línea conectora */}
              {!isLast && (
                <div className={`absolute left-6 top-12 w-0.5 h-full ${lineColor}`} />
              )}

              {/* Evento */}
              <div className="relative flex items-start gap-4">
                {/* Icono del evento */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full border-4 border-white ${colorClasses} flex items-center justify-center text-xl shadow-md z-10`}>
                  {event.icon}
                </div>

                {/* Contenido del evento */}
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(event.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Información adicional según el tipo */}
                  {event.type === 'milestone' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${project.completion_rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {project.completion_rate}%
                        </span>
                      </div>
                    </div>
                  )}

                  {event.type === 'risk' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Health Score:</span>
                        <span className={`font-semibold ${
                          project.health_score >= 70 ? 'text-green-600' :
                          project.health_score >= 50 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {project.health_score}/100
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Información del Project Manager */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Project Manager</p>
            <p className="font-semibold text-gray-900">{project.project_manager}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
