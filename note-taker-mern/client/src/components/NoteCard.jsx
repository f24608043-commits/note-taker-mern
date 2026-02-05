// src/components/NoteCard.jsx
import React from 'react';

export default function NoteCard({ note, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-md cursor-pointer ${note.completed
          ? 'bg-green-100 dark:bg-green-900/30 line-through'
          : 'bg-white dark:bg-gray-800'
        }`}
      onClick={() => onEdit(note)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {note.title || 'Untitled'}
        </h3>
        <span
          className={`px-2 py-1 text-xs rounded-full ${note.priority === 'high'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
              : note.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
            }`}
        >
          {note.priority || 'none'}
        </span>
      </div>

      <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
        {note.content?.substring(0, 100)}...
      </p>

      <div className="mt-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{formatDate(note.created_at)}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
          aria-label="Delete note"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}