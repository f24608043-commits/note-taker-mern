// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes } from '../services/notesService';
import NoteCard from '../components/NoteCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, highPriority: 0, completed: 0 });
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [missingTable, setMissingTable] = useState(false);

  useEffect(() => {
    if (!user) return;

    // 1. Start the timeout timer immediately
    const timer = setTimeout(() => {
      console.warn("⚠️ Dashboard loading timed out");
      setError('Dashboard took too long to load. Please refresh.');
      setLoading(false);
    }, 5000);

    const fetchData = async () => {
      try {
        console.log("👤 User ID:", user?.id);
        const notes = await getNotes(user.id);
        console.log("📊 Notes loaded:", notes.length);

        setStats({
          total: notes.length,
          highPriority: notes.filter(n => n.priority === 'high').length,
          completed: notes.filter(n => n.completed).length,
        });

        setRecentNotes(notes.slice(0, 3));
      } catch (err) {
        console.error("❌ Dashboard load error:", err);
        // Check for specific Supabase "table not found" error
        if (err.message && err.message.includes('Could not find the table')) {
          setMissingTable(true);
        } else {
          setError(err.message || 'Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
        clearTimeout(timer); // 2. Clear timeout on success/failure to prevent error
      }
    };

    fetchData();

    return () => clearTimeout(timer);
  }, [user]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  // Render Setup Guide if Table is Missing
  if (missingTable) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">⚠️ Database Setup Required</h2>
          <p className="text-yellow-700 mb-4">
            The application cannot find the <strong>notes</strong> table in your Supabase database.
            This is normal for a new project!
          </p>

          <div className="bg-white p-4 rounded border border-yellow-200 mb-4">
            <h3 className="font-bold text-gray-800 mb-2">How to Fix (1 Minute):</h3>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
              <li>Open your project's <strong>schema.sql</strong> file.</li>
              <li>Copy all the code inside.</li>
              <li>Go to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Supabase Dashboard</a>.</li>
              <li>Navigate to the <strong>SQL Editor</strong> section.</li>
              <li>Paste the code and click <strong>Run</strong>.</li>
            </ol>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition"
          >
            I've Run the SQL - Refresh App
          </button>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome back!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold opacity-90">Total Notes</h3>
          <p className="text-4xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-red-500 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold opacity-90">High Priority</h3>
          <p className="text-4xl font-bold mt-2">{stats.highPriority}</p>
        </div>
        <div className="bg-green-500 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold opacity-90">Completed</h3>
          <p className="text-4xl font-bold mt-2">{stats.completed}</p>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Recent Notes</h2>
        <Link to="/notes" className="text-blue-600 hover:underline">View All</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentNotes.length > 0 ? (
          recentNotes.map(note => (
            <NoteCard key={note.id} note={note} onEdit={() => { }} onDelete={() => { }} />
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center py-8">No notes yet. Start creating!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
