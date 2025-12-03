'use client';

import React from 'react';
import { MoreVertical, CheckCircle2, AlertCircle, Clock, Users, FileText, Plus } from 'lucide-react';
import { Project } from '@/lib/mockData';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  isDragging: boolean;
  onCreateTask?: () => void;
}

export default function ProjectCard({ project, onClick, isDragging, onCreateTask }: ProjectCardProps) {
  const getRiskBadge = () => {
    switch (project.risk_level) {
      case 'CRITICAL':
        return { color: 'bg-red-100 text-red-700 border-red-200', label: 'Crítico', icon: '🔴' };
      case 'WARNING':
        return { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Alerta', icon: '🟡' };
      default:
        return { color: 'bg-green-100 text-green-700 border-green-200', label: 'Saludable', icon: '🟢' };
    }
  };

  const riskBadge = getRiskBadge();

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-all ${
        isDragging ? 'shadow-2xl rotate-2 opacity-90' : ''
      }`}
    >
      {/* Header de la Tarjeta */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
            {project.app_name}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-1">
            {project.description || 'Sin descripción'}
          </p>
        </div>
        <button 
          className="p-1 hover:bg-gray-100 rounded"
          onClick={(e) => {
            e.stopPropagation();
            // Aquí iría la lógica del menú contextual
          }}
        >
          <MoreVertical size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Badge de Riesgo */}
      <div className="mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${riskBadge.color}`}>
          <span>{riskBadge.icon}</span>
          {riskBadge.label}
        </span>
      </div>

      {/* Barra de Progreso */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progreso</span>
          <span className="font-semibold">{project.completion_rate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${project.completion_rate}%` }}
          />
        </div>
      </div>

      {/* Métricas de la Tarjeta */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <CheckCircle2 size={14} className="text-green-500" />
          <span>{project.completed_tasks}/{project.total_tasks}</span>
        </div>
        {project.blocked_tasks > 0 && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle size={14} />
            <span>{project.blocked_tasks} bloqueadas</span>
          </div>
        )}
      </div>

      {/* Footer de la Tarjeta */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Users size={14} className="text-gray-400" />
          <span className="text-xs text-gray-600">{project.project_manager || 'Sin asignar'}</span>
        </div>
        {project.target_end_date && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />
            <span>{new Date(project.target_end_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Indicadores Visuales Adicionales */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        {project.has_deliverables && (
          <div className="p-1 bg-blue-50 rounded" title="Tiene entregables">
            <FileText size={12} className="text-blue-600" />
          </div>
        )}
        
        {/* Botón Crear Tarea */}
        {onCreateTask && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateTask();
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
            title="Crear nueva tarea"
          >
            <Plus size={14} />
            <span>Nueva Tarea</span>
          </button>
        )}
      </div>
    </div>
  );
}
