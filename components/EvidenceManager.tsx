'use client';

import React, { useState, useRef } from 'react';
import { Upload, File, Image, FileText, X, Download, Eye, Trash2 } from 'lucide-react';

interface Evidence {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

interface EvidenceManagerProps {
  taskId: string;
  taskTitle: string;
}

export default function EvidenceManager({ taskId, taskTitle }: EvidenceManagerProps) {
  const [evidences, setEvidences] = useState<Evidence[]>([
    {
      id: '1',
      fileName: 'arquitectura-diagrama.pdf',
      fileSize: 2500000,
      fileType: 'application/pdf',
      uploadedBy: 'María González',
      uploadedAt: '2025-01-10T10:30:00Z',
      url: '#',
    },
    {
      id: '2',
      fileName: 'screenshot-config.png',
      fileSize: 850000,
      fileType: 'image/png',
      uploadedBy: 'Carlos Ruiz',
      uploadedAt: '2025-01-12T14:20:00Z',
      url: '#',
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const newEvidence: Evidence = {
        id: Date.now().toString(),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: 'Usuario Actual',
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file),
      };
      setEvidences((prev) => [...prev, newEvidence]);
    });
    alert(`${files.length} archivo(s) subido(s) exitosamente`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={20} className="text-blue-600" />;
    if (fileType.includes('pdf')) return <FileText size={20} className="text-red-600" />;
    return <File size={20} className="text-gray-600" />;
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta evidencia?')) {
      setEvidences((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        />
        
        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Arrastra archivos aquí o haz click para seleccionar
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Soporta: Imágenes, PDF, Word, Excel (Máx. 10MB)
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Seleccionar Archivos
        </button>
      </div>

      {/* Evidence List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Evidencias Subidas ({evidences.length})
        </h3>
        
        <div className="space-y-3">
          {evidences.map((evidence) => (
            <div
              key={evidence.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* File Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getFileIcon(evidence.fileType)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{evidence.fileName}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{formatFileSize(evidence.fileSize)}</span>
                    <span>•</span>
                    <span>Subido por {evidence.uploadedBy}</span>
                    <span>•</span>
                    <span>
                      {new Date(evidence.uploadedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(evidence.url, '_blank')}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = evidence.url;
                      link.download = evidence.fileName;
                      link.click();
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Descargar"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(evidence.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {evidences.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No hay evidencias subidas aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
