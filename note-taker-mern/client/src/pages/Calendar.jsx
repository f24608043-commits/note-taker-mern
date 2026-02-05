// src/pages/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes } from '../services/notesService';
import dayjs from 'dayjs';
import isSameDay from 'dayjs/plugin/isSameDay';
import isToday from 'dayjs/plugin/isToday';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(isSameDay);
dayjs.extend(isToday);
dayjs.extend(weekday);
dayjs.extend(localeData);

const Calendar = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    if (!user) return;
    const fetchNotes = async () => {
      try {
        const data = await getNotes(user.id);
        setNotes(data);
      } catch (err) {
        console.error('Failed to load notes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [user]);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const daysInMonth = Array.from({ length: currentMonth.daysInMonth() }, (_, i) => i + 1);
  const startDay = currentMonth.startOf('month').weekday(); // 0 = Sunday

  const notesByDate = notes.reduce((acc, note) => {
    if (note.due_date) {
      const dateStr = dayjs(note.due_date).format('YYYY-MM-DD');
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(note);
    }
    return acc;
  }, {});

  const prevMonth = () => setCurrentMonth((prev) => prev.subtract(1, 'month'));
  const nextMonth = () => setCurrentMonth((prev) => prev.add(1, 'month'));

  if (loading) return <div className="p-8">Loading calendar...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            &larr;
          </button>
          <h2 className="text-xl font-semibold">
            {currentMonth.format('MMMM YYYY')}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 text-center font-medium text-gray-500 dark:text-gray-400 py-2">
          {dayjs.weekdaysMin().map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-t border-gray-200 dark:border-gray-700">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 border" />
          ))}

          {daysInMonth.map((day) => {
            const date = currentMonth.date(day);
            const dateStr = date.format('YYYY-MM-DD');
            const isToday = date.isToday();
            const hasNotes = notesByDate[dateStr] && notesByDate[dateStr].length > 0;

            return (
              <div
                key={day}
                className={`h-24 border border-gray-200 dark:border-gray-700 p-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 relative ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                onClick={() => handleSelectDate(date)}
              >
                <div
                  className={`text-sm ${isToday ? 'text-blue-600 font-bold dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {day}
                </div>
                {hasNotes && (
                  <div className="absolute bottom-1 left-1">
                    <span className="flex -space-x-1">
                      {notesByDate[dateStr].slice(0, 3).map((note, idx) => (
                        <span
                          key={idx}
                          className={`w-3 h-3 rounded-full ${note.priority === 'high'
                              ? 'bg-red-500'
                              : note.priority === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                          title={note.title}
                        />
                      ))}
                    </span>
                    {notesByDate[dateStr].length > 3 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{notesByDate[dateStr].length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Tasks for {selectedDate.format('dddd, MMMM D, YYYY')}
          </h3>
          {notesByDate[selectedDate.format('YYYY-MM-DD')] ? (
            <div className="space-y-3">
              {notesByDate[selectedDate.format('YYYY-MM-DD')].map((note) => (
                <div
                  key={note.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                >
                  <h4 className="font-semibold">{note.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {note.content?.substring(0, 50)}...
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No tasks for this day.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;