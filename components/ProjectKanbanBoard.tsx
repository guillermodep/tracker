'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  MoreVertical, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  FileText,
  TrendingUp,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { mockProjects, PHASES, Project } from '@/lib/mockData';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import CreateTaskModal, { NewTask } from './CreateTaskModal';

export default function ProjectKanbanBoard() {
  const [projects, setProjects] = useState<Record<string, Project[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<Project | null>(null);
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPM, setFilterPM] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterPhase, setFilterPhase] = useState('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const grouped = PHASES.reduce((acc, phase) => {
        acc[phase.id] = mockProjects.filter(p => p.status === phase.id);
        return acc;
      }, {} as Record<string, Project[]>);
      
      setProjects(grouped);
      setLoading(false);
    }, 500);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    // Actualizar estado local
    const sourceProjects = [...projects[source.droppableId]];
    const destProjects = [...projects[destination.droppableId]];
    
    const [movedProject] = sourceProjects.splice(source.index, 1);
    movedProject.status = destination.droppableId;
    destProjects.splice(destination.index, 0, movedProject);

    setProjects({
      ...projects,
      [source.droppableId]: sourceProjects,
      [destination.droppableId]: destProjects,
    });
  };

  const handleCreateTask = (project: Project) => {
    setSelectedProjectForTask(project);
    setCreateTaskModalOpen(true);
  };

  const handleTaskCreated = (task: NewTask) => {
    console.log('Nueva tarea creada:', task, 'para proyecto:', selectedProjectForTask?.app_name);
    // Aquí se agregaría la lógica para guardar la tarea
    // Por ahora solo mostramos en consola
    alert(`Tarea "${task.title}" creada exitosamente para ${selectedProjectForTask?.app_name}\nAsignada a: ${task.assigned_to}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  const totalProjects = Object.values(projects).flat().length;
  const criticalProjects = Object.values(projects).flat().filter(p => p.risk_level === 'CRITICAL').length;
  const completedProjects = projects['Production']?.length || 0;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header del Board */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Migration Tracker Board
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestión visual de proyectos de migración cloud
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm">
              <Plus size={20} />
              <span>Nuevo Proyecto</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="flex gap-4 mt-4">
          <QuickMetric 
            label="Total Proyectos" 
            value={totalProjects} 
            icon={<TrendingUp size={16} />}
            color="blue"
          />
          <QuickMetric 
            label="En Riesgo" 
            value={criticalProjects} 
            icon={<AlertTriangle size={16} />}
            color="red"
          />
          <QuickMetric 
            label="Completados" 
            value={completedProjects} 
            icon={<CheckCircle2 size={16} />}
            color="green"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 p-6 h-full min-w-max">
            {PHASES.map((phase) => (
              <KanbanColumn
                key={phase.id}
                phase={phase}
                projects={projects[phase.id] || []}
                onProjectClick={setSelectedProject}
                onCreateTask={handleCreateTask}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Modal de Detalles del Proyecto */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Modal de Crear Tarea */}
      {createTaskModalOpen && selectedProjectForTask && (
        <CreateTaskModal
          isOpen={createTaskModalOpen}
          onClose={() => {
            setCreateTaskModalOpen(false);
            setSelectedProjectForTask(null);
          }}
          projectName={selectedProjectForTask.app_name}
          onCreateTask={handleTaskCreated}
        />
      )}
    </div>
  );
}

// Componente de Columna Kanban
interface KanbanColumnProps {
  phase: { id: string; name: string; color: string; icon: string };
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onCreateTask: (project: Project) => void;
}

function KanbanColumn({ phase, projects, onProjectClick, onCreateTask }: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 bg-gray-100 rounded-lg flex flex-col shadow-sm">
      {/* Header de la Columna */}
      <div 
        className="p-4 border-b-4 rounded-t-lg bg-white"
        style={{ borderColor: phase.color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{phase.icon}</span>
            <h3 className="font-semibold text-gray-900">{phase.name}</h3>
          </div>
          <span className="bg-gray-100 px-2 py-1 rounded-full text-sm font-medium text-gray-600">
            {projects.length}
          </span>
        </div>
      </div>

      {/* Lista de Tarjetas */}
      <Droppable droppableId={phase.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 space-y-3 overflow-y-auto ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
            style={{ minHeight: '200px' }}
          >
            {projects.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-8">
                No hay proyectos en esta fase
              </div>
            ) : (
              projects.map((project, index) => (
                <Draggable
                  key={project.id}
                  draggableId={project.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ProjectCard
                        project={project}
                        onClick={() => onProjectClick(project)}
                        isDragging={snapshot.isDragging}
                        onCreateTask={() => onCreateTask(project)}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

// Componente de Métrica Rápida
interface QuickMetricProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green';
}

function QuickMetric({ label, value, icon, color }: QuickMetricProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className={`p-2 rounded ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
