import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes, createNote, updateNote, deleteNote } from '../services/notesService';
import NoteCard from '../components/NoteCard';
import TaskModal from '../components/TaskModal';

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Debug: Check user ID
    console.log("👤 User ID in Notes:", user?.id);

    if (!user) return;
    const fetchNotes = async () => {
      try {
        const data = await getNotes(user.id);
        setNotes(data || []);
      } catch (err) {
        console.error('Failed to load notes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [user]);

  const handleSave = async (noteData) => {
    try {
      if (editingNote && editingNote.id) {
        const updated = await updateNote(editingNote.id, noteData);
        setNotes(notes.map(n => n.id === updated.id ? updated : n));
      } else {
        const newNote = await createNote(noteData, user.id);
        setNotes([newNote, ...notes]);
      }
      setEditingNote(null);
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to save note: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      alert('Failed to delete note: ' + err.message);
    }
  };

  const handleCreate = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading notes...</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
        >
          + New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">You don't have any notes yet.</p>
          <button onClick={handleCreate} className="text-blue-600 hover:underline">Create one now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        note={editingNote}
      />
    </div>
  );
};

export default Notes;