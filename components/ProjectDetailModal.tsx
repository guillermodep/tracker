'use client';

import React, { useState } from 'react';
import { X, TrendingUp, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Project, mockPhases } from '@/lib/mockData';

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
            <div className="text-center text-gray-500 py-12">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Vista de tareas en desarrollo</p>
            </div>
          )}
          {activeTab === 'timeline' && (
            <div className="text-center text-gray-500 py-12">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Timeline en desarrollo</p>
            </div>
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
