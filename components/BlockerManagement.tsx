'use client';

import React, { useState } from 'react';
import { X, AlertCircle, Clock, User, Calendar, FileText } from 'lucide-react';
import { mockBlockers } from '@/lib/mockData';

interface BlockerManagementProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
  taskTitle?: string;
}

export default function BlockerManagement({ isOpen, onClose, taskId, taskTitle }: BlockerManagementProps) {
  const [formData, setFormData] = useState({
    reason: '',
    responsible_entity: '',
    responsible_person: '',
    estimated_resolution: '',
    impact: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Blocker registrado:', formData);
    alert(`Bloqueo registrado para: ${taskTitle}\nResponsable: ${formData.responsible_person}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between bg-red-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle size={24} className="text-red-600" />
              Registrar Bloqueo
            </h2>
            {taskTitle && (
              <p className="text-sm text-gray-600 mt-1">Tarea: {taskTitle}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Razón del Bloqueo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razón del Bloqueo *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
              rows={3}
              placeholder="Describe detalladamente la razón del bloqueo..."
              required
            />
          </div>

          {/* Entidad Responsable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entidad Responsable *
            </label>
            <select
              value={formData.responsible_entity}
              onChange={(e) => setFormData({ ...formData, responsible_entity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Seleccionar entidad</option>
              <option value="Banco Pichincha">Banco Pichincha</option>
              <option value="EPAM Neoris">EPAM Neoris</option>
              <option value="Smart Arq">Smart Arq</option>
              <option value="Smart Developer">Smart Developer</option>
              <option value="Otro Vendor">Otro Vendor</option>
            </select>
          </div>

          {/* Persona Responsable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User size={16} className="inline mr-1" />
              Persona Responsable *
            </label>
            <input
              type="text"
              value={formData.responsible_person}
              onChange={(e) => setFormData({ ...formData, responsible_person: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              placeholder="Nombre de la persona responsable"
              required
            />
          </div>

          {/* Fecha Estimada de Resolución e Impacto */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar size={16} className="inline mr-1" />
                Resolución Estimada
              </label>
              <input
                type="date"
                value={formData.estimated_resolution}
                onChange={(e) => setFormData({ ...formData, estimated_resolution: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Impacto
              </label>
              <select
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              >
                <option value="low">Bajo</option>
                <option value="medium">Medio</option>
                <option value="high">Alto</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <AlertCircle size={16} />
              Registrar Bloqueo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para mostrar historial de bloqueos
export function BlockerHistory() {
  const blockers = mockBlockers;

  const calculateSLAImpact = (hoursBlocked: number) => {
    const days = Math.floor(hoursBlocked / 24);
    const hours = hoursBlocked % 24;
    return { days, hours };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Historial de Bloqueos ({blockers.length})
        </h3>
      </div>

      <div className="space-y-3">
        {blockers.map((blocker) => {
          const { days, hours } = calculateSLAImpact(blocker.hours_blocked);

          return (
            <div
              key={blocker.id}
              className="bg-white border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    {blocker.task_title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{blocker.reason}</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  {days}d {hours}h bloqueado
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Responsable</p>
                  <p className="text-sm font-medium text-gray-900">{blocker.responsible_person_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Entidad</p>
                  <p className="text-sm font-medium text-gray-900">{blocker.entity_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Inicio</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(blocker.start_time).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>

              {/* Impacto en SLA */}
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-xs font-medium text-red-900">
                  Impacto en SLA: {blocker.hours_blocked} horas de retraso atribuibles a {blocker.entity_name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
