# J2C Migration Tracker

Sistema de gestión de migraciones cloud con vendor management estilo Jira.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📋 Características

- **Kanban Board Estilo Jira**: Vista visual de proyectos organizados por fase
- **Drag & Drop**: Arrastra proyectos entre fases
- **Tarjetas Informativas**: Métricas, progreso, riesgo y más
- **Modal de Detalles**: Información completa de cada proyecto
- **Datos Mockeados**: 10 proyectos de ejemplo con datos realistas

## 🏗️ Estructura del Proyecto

```
J2CTracker/
├── app/
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página principal
├── components/
│   ├── ProjectKanbanBoard.tsx    # Componente principal del board
│   ├── ProjectCard.tsx           # Tarjeta de proyecto
│   └── ProjectDetailModal.tsx    # Modal de detalles
├── lib/
│   └── mockData.ts           # Datos mockeados
└── requerimiento.md          # Especificación técnica completa
```

## 🎨 Stack Tecnológico

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **@hello-pangea/dnd** - Drag & Drop
- **Lucide React** - Iconos

## 📊 Datos Mockeados

El proyecto incluye:
- 10 proyectos de ejemplo
- 7 fases del framework de migración
- Tareas con diferentes estados
- Bloqueos simulados
- Métricas de progreso

## 🔧 Próximos Pasos

1. Instalar dependencias: `npm install`
2. Ejecutar en desarrollo: `npm run dev`
3. Ver la aplicación en http://localhost:3000

## 📝 Notas

- Los datos son completamente mockeados (no hay base de datos)
- El drag & drop actualiza el estado local
- Los errores de TypeScript se resolverán al instalar las dependencias
