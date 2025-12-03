// Mock Data para el Migration Tracker

export interface Project {
  id: string;
  app_name: string;
  status: string;
  description: string;
  completion_rate: number;
  blocked_tasks: number;
  total_tasks: number;
  completed_tasks: number;
  project_manager: string;
  target_end_date: string;
  health_score: number;
  risk_level: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  has_deliverables: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Blocked' | 'Done';
  assigned_entity_name: string;
  is_deliverable: boolean;
  is_blocker: boolean;
  planned_end_date: string;
  urgency_status: 'On Track' | 'Risk' | 'Overdue' | 'Blocked' | 'Done';
  responsible_person_name?: string;
}

export interface Phase {
  id: string;
  name: string;
  order_index: number;
  tasks: Task[];
}

export interface Blocker {
  id: string;
  task_title: string;
  reason: string;
  responsible_person_name: string;
  entity_name: string;
  start_time: string;
  hours_blocked: number;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    app_name: 'Portal Clientes Web',
    status: 'Discovery',
    description: 'Migración del portal de clientes a arquitectura cloud-native',
    completion_rate: 15,
    blocked_tasks: 2,
    total_tasks: 45,
    completed_tasks: 7,
    project_manager: 'María González',
    target_end_date: '2025-03-15',
    health_score: 60,
    risk_level: 'WARNING',
    has_deliverables: true,
  },
  {
    id: '2',
    app_name: 'API Gateway Transaccional',
    status: 'Design',
    description: 'Rediseño y migración del gateway de transacciones',
    completion_rate: 35,
    blocked_tasks: 0,
    total_tasks: 38,
    completed_tasks: 13,
    project_manager: 'Carlos Ruiz',
    target_end_date: '2025-02-28',
    health_score: 90,
    risk_level: 'HEALTHY',
    has_deliverables: true,
  },
  {
    id: '3',
    app_name: 'Sistema de Pagos',
    status: 'Development',
    description: 'Modernización del sistema de procesamiento de pagos',
    completion_rate: 58,
    blocked_tasks: 1,
    total_tasks: 52,
    completed_tasks: 30,
    project_manager: 'Ana Martínez',
    target_end_date: '2025-04-10',
    health_score: 75,
    risk_level: 'HEALTHY',
    has_deliverables: false,
  },
  {
    id: '4',
    app_name: 'Core Banking Legacy',
    status: 'Discovery',
    description: 'Análisis y estrategia de migración del core bancario',
    completion_rate: 8,
    blocked_tasks: 5,
    total_tasks: 67,
    completed_tasks: 5,
    project_manager: 'Roberto Silva',
    target_end_date: '2025-06-30',
    health_score: 30,
    risk_level: 'CRITICAL',
    has_deliverables: true,
  },
  {
    id: '5',
    app_name: 'Mobile Banking App',
    status: 'Testing',
    description: 'Migración de la aplicación móvil a nueva infraestructura',
    completion_rate: 72,
    blocked_tasks: 0,
    total_tasks: 41,
    completed_tasks: 30,
    project_manager: 'Laura Pérez',
    target_end_date: '2025-02-15',
    health_score: 85,
    risk_level: 'HEALTHY',
    has_deliverables: true,
  },
  {
    id: '6',
    app_name: 'Sistema de Reportes',
    status: 'UAT',
    description: 'Migración del sistema de generación de reportes regulatorios',
    completion_rate: 88,
    blocked_tasks: 1,
    total_tasks: 35,
    completed_tasks: 31,
    project_manager: 'Diego Torres',
    target_end_date: '2025-01-30',
    health_score: 70,
    risk_level: 'WARNING',
    has_deliverables: false,
  },
  {
    id: '7',
    app_name: 'Portal Empleados',
    status: 'Pre-Production',
    description: 'Migración del portal interno de empleados',
    completion_rate: 95,
    blocked_tasks: 0,
    total_tasks: 28,
    completed_tasks: 27,
    project_manager: 'Patricia Vargas',
    target_end_date: '2025-01-20',
    health_score: 95,
    risk_level: 'HEALTHY',
    has_deliverables: true,
  },
  {
    id: '8',
    app_name: 'Sistema de Notificaciones',
    status: 'Production',
    description: 'Sistema de envío de notificaciones multicanal',
    completion_rate: 100,
    blocked_tasks: 0,
    total_tasks: 32,
    completed_tasks: 32,
    project_manager: 'Fernando López',
    target_end_date: '2024-12-15',
    health_score: 100,
    risk_level: 'HEALTHY',
    has_deliverables: false,
  },
  {
    id: '9',
    app_name: 'CRM Comercial',
    status: 'Development',
    description: 'Migración del CRM a plataforma cloud',
    completion_rate: 45,
    blocked_tasks: 3,
    total_tasks: 48,
    completed_tasks: 22,
    project_manager: 'Sofía Ramírez',
    target_end_date: '2025-03-30',
    health_score: 55,
    risk_level: 'WARNING',
    has_deliverables: true,
  },
  {
    id: '10',
    app_name: 'Sistema de Auditoría',
    status: 'Design',
    description: 'Rediseño del sistema de auditoría y compliance',
    completion_rate: 28,
    blocked_tasks: 0,
    total_tasks: 44,
    completed_tasks: 12,
    project_manager: 'Miguel Ángel Castro',
    target_end_date: '2025-05-15',
    health_score: 80,
    risk_level: 'HEALTHY',
    has_deliverables: true,
  },
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Análisis de arquitectura actual',
    description: 'Documentar la arquitectura existente del sistema',
    status: 'Done',
    assigned_entity_name: 'Smart Arq',
    is_deliverable: true,
    is_blocker: false,
    planned_end_date: '2025-01-10',
    urgency_status: 'Done',
  },
  {
    id: 't2',
    title: 'Definición de estrategia de migración',
    description: 'Establecer el plan de migración cloud',
    status: 'In Progress',
    assigned_entity_name: 'Smart Arq',
    is_deliverable: true,
    is_blocker: true,
    planned_end_date: '2025-01-20',
    urgency_status: 'On Track',
  },
  {
    id: 't3',
    title: 'Aprobación de presupuesto',
    description: 'Obtener aprobación del presupuesto de migración',
    status: 'Blocked',
    assigned_entity_name: 'Banco Pichincha',
    is_deliverable: false,
    is_blocker: true,
    planned_end_date: '2025-01-15',
    urgency_status: 'Blocked',
    responsible_person_name: 'Juan Pérez',
  },
  {
    id: 't4',
    title: 'Configuración de entorno cloud',
    description: 'Setup inicial de la infraestructura en AWS',
    status: 'Pending',
    assigned_entity_name: 'Smart DevOps',
    is_deliverable: false,
    is_blocker: false,
    planned_end_date: '2025-01-25',
    urgency_status: 'On Track',
  },
  {
    id: 't5',
    title: 'Revisión de seguridad',
    description: 'Validación de controles de seguridad',
    status: 'Blocked',
    assigned_entity_name: 'EPAM Neoris',
    is_deliverable: true,
    is_blocker: true,
    planned_end_date: '2025-01-12',
    urgency_status: 'Blocked',
    responsible_person_name: 'María González',
  },
  {
    id: 't6',
    title: 'Desarrollo de APIs REST',
    description: 'Implementación de servicios REST',
    status: 'In Progress',
    assigned_entity_name: 'Smart Developer',
    is_deliverable: false,
    is_blocker: false,
    planned_end_date: '2025-02-01',
    urgency_status: 'Risk',
  },
];

export const mockPhases: Phase[] = [
  {
    id: 'p1',
    name: 'Discovery',
    order_index: 1,
    tasks: mockTasks.slice(0, 2),
  },
  {
    id: 'p2',
    name: 'Design',
    order_index: 2,
    tasks: mockTasks.slice(2, 4),
  },
  {
    id: 'p3',
    name: 'Development',
    order_index: 3,
    tasks: mockTasks.slice(4, 6),
  },
];

export const mockBlockers: Blocker[] = [
  {
    id: 'b1',
    task_title: 'Aprobación de presupuesto',
    reason: 'Falta firma del CFO para aprobar el presupuesto de migración',
    responsible_person_name: 'Juan Pérez',
    entity_name: 'Banco Pichincha',
    start_time: '2025-01-10T10:00:00Z',
    hours_blocked: 72,
  },
  {
    id: 'b2',
    task_title: 'Revisión de seguridad',
    reason: 'Pendiente entrega de documentación de compliance',
    responsible_person_name: 'María González',
    entity_name: 'EPAM Neoris',
    start_time: '2025-01-08T14:30:00Z',
    hours_blocked: 96,
  },
  {
    id: 'b3',
    task_title: 'Acceso a base de datos producción',
    reason: 'No se han entregado credenciales de acceso',
    responsible_person_name: 'Carlos Mendoza',
    entity_name: 'Banco Pichincha',
    start_time: '2025-01-12T09:00:00Z',
    hours_blocked: 48,
  },
];

export const PHASES = [
  { id: 'Discovery', name: 'Discovery', color: '#3B82F6', icon: '🔍' },
  { id: 'Design', name: 'Design', color: '#8B5CF6', icon: '🎨' },
  { id: 'Development', name: 'Development', color: '#10B981', icon: '⚙️' },
  { id: 'Testing', name: 'Testing', color: '#F59E0B', icon: '🧪' },
  { id: 'UAT', name: 'UAT', color: '#EC4899', icon: '✅' },
  { id: 'Pre-Production', name: 'Pre-Production', color: '#6366F1', icon: '🚀' },
  { id: 'Production', name: 'Production', color: '#10B981', icon: '✨' },
];
