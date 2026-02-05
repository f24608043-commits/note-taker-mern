// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes } from '../services/notesService';

export default function Dashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      try {
        const data = await getNotes(user.id);
        setNotes(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [user]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const total = notes.length;
  const completed = notes.filter(n => n.completed).length;
  const pending = total - completed;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Notes</h3>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{completed}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Pending</h3>
          <p className="text-2xl font-bold text-red-500">{pending}</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Notes</h2>
        {notes.slice(0, 3).map(note => (
          <div key={note.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-2">
            <h3 className="font-semibold">{note.title || 'Untitled'}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {note.content?.substring(0, 50)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}