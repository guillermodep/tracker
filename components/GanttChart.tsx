'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Calendar } from 'lucide-react';
import { mockProjects } from '@/lib/mockData';

export default function GanttChart() {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Generar meses para el timeline
  const generateMonths = () => {
    const months = [];
    const start = new Date(2024, 11, 1); // Diciembre 2024
    for (let i = 0; i < 6; i++) {
      const date = new Date(start);
      date.setMonth(start.getMonth() + i);
      months.push({
        name: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        date: date,
      });
    }
    return months;
  };

  const months = generateMonths();

  const calculatePosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timelineStart = new Date(2024, 11, 1);
    const timelineEnd = new Date(2025, 4, 31);

    const totalDays = (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const startOffset = (start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;

    return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` };
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'WARNING':
        return 'bg-orange-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={28} />
              Gantt Chart
            </h2>
            <p className="text-sm text-gray-500 mt-1">Vista temporal de proyectos</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600">Saludable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-600">Alerta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-600">Crítico</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Timeline Header */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <div className="w-80 p-4 font-semibold text-gray-700 border-r border-gray-200">
              Proyecto
            </div>
            <div className="flex-1 flex">
              {months.map((month, index) => (
                <div
                  key={index}
                  className="flex-1 p-4 text-center font-semibold text-gray-700 border-r border-gray-200"
                >
                  {month.name}
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          {mockProjects.map((project) => {
            const isExpanded = expandedProjects.has(project.id);
            const position = calculatePosition(
              project.start_date || '2024-12-01',
              project.target_end_date
            );

            return (
              <div key={project.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                {/* Project Row */}
                <div className="flex items-center">
                  <div className="w-80 p-4 border-r border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleProject(project.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown size={16} className="text-gray-600" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-600" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">
                          {project.app_name}
                        </p>
                        <p className="text-xs text-gray-500">{project.project_manager}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 p-4 relative h-16">
                    <div
                      className={`absolute top-1/2 transform -translate-y-1/2 h-8 ${getRiskColor(
                        project.risk_level
                      )} rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group`}
                      style={position}
                    >
                      <div className="h-full flex items-center justify-center px-2">
                        <span className="text-xs font-medium text-white truncate">
                          {project.completion_rate}%
                        </span>
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                          <p className="font-semibold">{project.app_name}</p>
                          <p className="text-gray-300">
                            {new Date(project.start_date || '2024-12-01').toLocaleDateString('es-ES')} -{' '}
                            {new Date(project.target_end_date).toLocaleDateString('es-ES')}
                          </p>
                          <p className="text-gray-300">Completitud: {project.completion_rate}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Today Marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-500"
                      style={{ left: '30%' }}
                      title="Hoy"
                    >
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-gray-50 border-t border-gray-200">
                    <div className="flex">
                      <div className="w-80 p-4 border-r border-gray-200">
                        <div className="pl-8 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estado:</span>
                            <span className="font-medium text-gray-900">{project.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tareas:</span>
                            <span className="font-medium text-gray-900">
                              {project.completed_tasks}/{project.total_tasks}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Health Score:</span>
                            <span className={`font-medium ${
                              project.health_score >= 70 ? 'text-green-600' :
                              project.health_score >= 50 ? 'text-orange-600' :
                              'text-red-600'
                            }`}>
                              {project.health_score}/100
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="text-sm text-gray-600">
                          {project.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
