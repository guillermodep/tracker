'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, User, Clock, Edit2, Trash2, Heart, Reply } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

interface Activity {
  id: string;
  type: 'comment' | 'status_change' | 'assignment' | 'blocker' | 'evidence';
  user: string;
  action: string;
  timestamp: string;
  details?: string;
}

export function CommentsSection({ taskId }: { taskId: string }) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'María González',
      content: 'He revisado la documentación y todo parece estar en orden. Podemos proceder con la siguiente fase.',
      createdAt: '2025-01-10T10:30:00Z',
      likes: 3,
      replies: [
        {
          id: '1-1',
          author: 'Carlos Ruiz',
          content: 'Perfecto, gracias por la revisión!',
          createdAt: '2025-01-10T11:00:00Z',
          likes: 1,
        },
      ],
    },
    {
      id: '2',
      author: 'Ana Martínez',
      content: '@María González ¿Podrías revisar el diagrama de arquitectura? Creo que falta incluir el componente de cache.',
      createdAt: '2025-01-11T14:20:00Z',
      likes: 0,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Usuario Actual',
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    if (replyingTo) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyingTo
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        )
      );
      setReplyingTo(null);
    } else {
      setComments((prev) => [...prev, comment]);
    }

    setNewComment('');
  };

  const handleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      )
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare size={20} />
          Comentarios ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="bg-white border border-gray-200 rounded-lg p-4">
        {replyingTo && (
          <div className="mb-2 text-sm text-gray-600 flex items-center justify-between">
            <span>Respondiendo a comentario...</span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-red-600 hover:text-red-700"
            >
              Cancelar
            </button>
          </div>
        )}
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            U
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario... Usa @ para mencionar"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Send size={16} />
                Comentar
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {getInitials(comment.author)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {formatTimestamp(comment.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Heart size={16} />
                    <span>{comment.likes > 0 && comment.likes}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Reply size={16} />
                    Responder
                  </button>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {getInitials(reply.author)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900">{reply.author}</span>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityFeed({ projectId }: { projectId: string }) {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'status_change',
      user: 'María González',
      action: 'cambió el estado de',
      timestamp: '2025-01-12T10:30:00Z',
      details: 'Pendiente → En Progreso',
    },
    {
      id: '2',
      type: 'assignment',
      user: 'Carlos Ruiz',
      action: 'asignó la tarea a',
      timestamp: '2025-01-12T09:15:00Z',
      details: 'Ana Martínez',
    },
    {
      id: '3',
      type: 'blocker',
      user: 'System',
      action: 'registró un bloqueo en',
      timestamp: '2025-01-11T16:45:00Z',
      details: 'Aprobación de presupuesto',
    },
    {
      id: '4',
      type: 'evidence',
      user: 'Ana Martínez',
      action: 'subió una evidencia a',
      timestamp: '2025-01-11T14:20:00Z',
      details: 'arquitectura-diagrama.pdf',
    },
    {
      id: '5',
      type: 'comment',
      user: 'Diego Torres',
      action: 'comentó en',
      timestamp: '2025-01-10T11:30:00Z',
      details: 'Revisión de seguridad',
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare size={16} className="text-blue-600" />;
      case 'status_change':
        return <Clock size={16} className="text-purple-600" />;
      case 'assignment':
        return <User size={16} className="text-green-600" />;
      case 'blocker':
        return <MessageSquare size={16} className="text-red-600" />;
      case 'evidence':
        return <MessageSquare size={16} className="text-orange-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Feed de Actividad</h3>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative">
            {index < activities.length - 1 && (
              <div className="absolute left-4 top-10 w-0.5 h-full bg-gray-200" />
            )}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center z-10">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{activity.user}</span>{' '}
                  <span className="text-gray-600">{activity.action}</span>{' '}
                  {activity.details && (
                    <span className="font-medium">{activity.details}</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
