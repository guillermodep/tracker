'use client';

import React from 'react';
import { Search, Filter, X, LayoutGrid, List } from 'lucide-react';

interface AdvancedFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterPM: string;
  onFilterPMChange: (value: string) => void;
  filterRisk: string;
  onFilterRiskChange: (value: string) => void;
  filterPhase: string;
  onFilterPhaseChange: (value: string) => void;
  viewMode: 'kanban' | 'list';
  onViewModeChange: (mode: 'kanban' | 'list') => void;
  projectManagers: string[];
  onClearFilters: () => void;
}

export default function AdvancedFilters({
  searchQuery,
  onSearchChange,
  filterPM,
  onFilterPMChange,
  filterRisk,
  onFilterRiskChange,
  filterPhase,
  onFilterPhaseChange,
  viewMode,
  onViewModeChange,
  projectManagers,
  onClearFilters,
}: AdvancedFiltersProps) {
  const hasActiveFilters = filterPM !== 'all' || filterRisk !== 'all' || filterPhase !== 'all' || searchQuery !== '';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 space-y-4">
      {/* Primera fila: Búsqueda y Vista */}
      <div className="flex items-center gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar proyectos por nombre, PM o descripción..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Toggle Vista */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('kanban')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'kanban'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutGrid size={16} />
            Kanban
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List size={16} />
            Lista
          </button>
        </div>
      </div>

      {/* Segunda fila: Filtros */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter size={16} />
          Filtros:
        </div>

        {/* Filtro por PM */}
        <select
          value={filterPM}
          onChange={(e) => onFilterPMChange(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          <option value="all">Todos los PMs</option>
          {projectManagers.map((pm) => (
            <option key={pm} value={pm}>
              {pm}
            </option>
          ))}
        </select>

        {/* Filtro por Riesgo */}
        <select
          value={filterRisk}
          onChange={(e) => onFilterRiskChange(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          <option value="all">Todos los riesgos</option>
          <option value="CRITICAL">🔴 Crítico</option>
          <option value="WARNING">🟡 Alerta</option>
          <option value="HEALTHY">🟢 Saludable</option>
        </select>

        {/* Filtro por Fase */}
        <select
          value={filterPhase}
          onChange={(e) => onFilterPhaseChange(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          <option value="all">Todas las fases</option>
          <option value="Discovery">🔍 Discovery</option>
          <option value="Design">🎨 Design</option>
          <option value="Development">⚙️ Development</option>
          <option value="Testing">🧪 Testing</option>
          <option value="UAT">✅ UAT</option>
          <option value="Pre-Production">🚀 Pre-Production</option>
          <option value="Production">🎯 Production</option>
        </select>

        {/* Limpiar Filtros */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={16} />
            Limpiar
          </button>
        )}

        {/* Contador de resultados */}
        <div className="ml-auto text-sm text-gray-500">
          {hasActiveFilters && <span className="font-medium">Filtros activos</span>}
        </div>
      </div>
    </div>
  );
}
