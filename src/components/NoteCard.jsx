import React from 'react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const priorityColor = {
    high: 'bg-red-100 border-red-200 text-red-800',
    medium: 'bg-yellow-100 border-yellow-200 text-yellow-800',
    low: 'bg-green-100 border-green-200 text-green-800',
  }[note.priority] || 'bg-gray-100 border-gray-200 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-800 truncate pr-2">{note.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${priorityColor} uppercase font-semibold`}>
          {note.priority}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3 whitespace-pre-wrap">{note.content}</p>

      <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
        <span>{note.due_date ? new Date(note.due_date).toLocaleDateString() : 'No due date'}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(note)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;