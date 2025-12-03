'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Target, Zap, Clock, AlertTriangle } from 'lucide-react';
import { mockProjects } from '@/lib/mockData';

export default function AdvancedMetrics() {
  // Calcular métricas avanzadas
  const calculateVelocity = () => {
    const completedLastWeek = 15;
    const completedThisWeek = 22;
    const change = ((completedThisWeek - completedLastWeek) / completedLastWeek) * 100;
    return { current: completedThisWeek, change: change.toFixed(1) };
  };

  const calculatePredictedCompletion = () => {
    const avgCompletionRate = mockProjects.reduce((sum, p) => sum + p.completion_rate, 0) / mockProjects.length;
    const avgVelocity = 3.5; // tareas por semana
    const remainingTasks = mockProjects.reduce((sum, p) => sum + (p.total_tasks - p.completed_tasks), 0);
    const weeksRemaining = Math.ceil(remainingTasks / avgVelocity);
    
    const predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + (weeksRemaining * 7));
    
    return {
      weeks: weeksRemaining,
      date: predictedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
  };

  const calculateBottlenecks = () => {
    const bottlenecks = [
      { phase: 'UAT', count: 3, avgDays: 12 },
      { phase: 'Testing', count: 2, avgDays: 8 },
      { phase: 'Design', count: 1, avgDays: 15 },
    ];
    return bottlenecks;
  };

  const calculateSLACompliance = () => {
    const totalProjects = mockProjects.length;
    const onTime = mockProjects.filter(p => {
      const daysUntil = Math.ceil(
        (new Date(p.target_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntil > 0 && p.completion_rate >= 50;
    }).length;
    
    return {
      percentage: Math.round((onTime / totalProjects) * 100),
      onTime,
      total: totalProjects,
    };
  };

  const velocity = calculateVelocity();
  const prediction = calculatePredictedCompletion();
  const bottlenecks = calculateBottlenecks();
  const slaCompliance = calculateSLACompliance();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Métricas Avanzadas</h2>

      {/* Velocity y Predicciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Velocity */}
        <MetricCard
          title="Velocity (Tareas/Semana)"
          value={velocity.current}
          trend={`${parseFloat(velocity.change) > 0 ? '+' : ''}${velocity.change}%`}
          trendUp={parseFloat(velocity.change) > 0}
          icon={<Zap size={24} />}
          color="purple"
        />

        {/* Predicción de Finalización */}
        <MetricCard
          title="Finalización Estimada"
          value={`${prediction.weeks} sem`}
          trend={prediction.date}
          icon={<Target size={24} />}
          color="blue"
        />

        {/* SLA Compliance */}
        <MetricCard
          title="SLA Compliance"
          value={`${slaCompliance.percentage}%`}
          trend={`${slaCompliance.onTime}/${slaCompliance.total} proyectos`}
          trendUp={slaCompliance.percentage >= 70}
          icon={<Clock size={24} />}
          color="green"
        />

        {/* Cuellos de Botella */}
        <MetricCard
          title="Cuellos de Botella"
          value={bottlenecks.length}
          trend="Fases identificadas"
          icon={<AlertTriangle size={24} />}
          color="orange"
        />
      </div>

      {/* Análisis de Cuellos de Botella */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Cuellos de Botella</h3>
        <div className="space-y-4">
          {bottlenecks.map((bottleneck, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={18} className="text-orange-600" />
                  <h4 className="font-semibold text-gray-900">{bottleneck.phase}</h4>
                </div>
                <p className="text-sm text-gray-600">
                  {bottleneck.count} proyecto(s) con tiempo promedio de {bottleneck.avgDays} días
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">{bottleneck.avgDays}d</p>
                <p className="text-xs text-gray-500">Promedio</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparativa de Proyectos */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de Proyectos</h3>
        <div className="space-y-3">
          {mockProjects.slice(0, 5).map((project) => (
            <div key={project.id} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{project.app_name}</span>
                  <span className="text-sm text-gray-600">{project.completion_rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      project.completion_rate >= 70 ? 'bg-green-500' :
                      project.completion_rate >= 40 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${project.completion_rate}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.health_score >= 70 ? 'bg-green-100 text-green-700' :
                  project.health_score >= 50 ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {project.health_score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Accountability */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accountability por Vendor</h3>
        <div className="space-y-4">
          {[
            { vendor: 'Banco Pichincha', blockedHours: 120, projects: 3, avgResponse: '48h' },
            { vendor: 'EPAM Neoris', blockedHours: 96, projects: 2, avgResponse: '36h' },
            { vendor: 'Smart Arq', blockedHours: 24, projects: 1, avgResponse: '12h' },
          ].map((vendor, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{vendor.vendor}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  vendor.blockedHours > 100 ? 'bg-red-100 text-red-700' :
                  vendor.blockedHours > 50 ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {vendor.blockedHours}h bloqueadas
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Proyectos Afectados</p>
                  <p className="font-semibold text-gray-900">{vendor.projects}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tiempo de Respuesta</p>
                  <p className="font-semibold text-gray-900">{vendor.avgResponse}</p>
                </div>
                <div>
                  <p className="text-gray-500">Impacto en SLA</p>
                  <p className="font-semibold text-red-600">{Math.round(vendor.blockedHours / 24)}d</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  color: 'purple' | 'blue' | 'green' | 'orange';
}

function MetricCard({ title, value, trend, trendUp, icon, color }: MetricCardProps) {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        {trend && trendUp !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        {trend && <p className="text-xs text-gray-600">{trend}</p>}
      </div>
    </div>
  );
}
