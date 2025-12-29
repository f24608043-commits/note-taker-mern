import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes } from '../services/notesService';

const Calendar = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchNotes = async () => {
      try {
        const data = await getNotes(user.id);
        // Filter notes with due dates
        const withDates = data
          .filter(n => n.due_date)
          .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
        setNotes(withDates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading calendar...</div>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Deadlines</h1>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {notes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No upcoming deadlines found in your notes.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notes.map(note => {
              const date = new Date(note.due_date);
              const isPast = date < new Date();
              return (
                <div key={note.id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-16 text-center rounded p-2 ${isPast ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      <div className="text-xs font-bold uppercase">{date.toLocaleString('default', { month: 'short' })}</div>
                      <div className="text-xl font-bold">{date.getDate()}</div>
                    </div>
                    <div>
                      <h3 className={`font-semibold text-gray-800 ${note.completed ? 'line-through text-gray-400' : ''}`}>
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate max-w-md">{note.content}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border uppercase font-medium ${note.priority === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                      note.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-green-100 text-green-700 border-green-200'
                    }`}>
                    {note.priority}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
