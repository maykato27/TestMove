import { useState } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WeeklyView from './components/WeeklyView';
import MonthlyView from './components/MonthlyView';
import { getWorkouts } from './storage';
import { demoWorkouts } from './demoData';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const isDemoMode =
    new URLSearchParams(window.location.search).get('demo') === 'true';
  const [workouts, setWorkouts] = useState(
    isDemoMode ? demoWorkouts : getWorkouts()
  );

  function handleSave() {
    if (!isDemoMode) {
      setWorkouts(getWorkouts());
    }
    setShowForm(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">MOVE</h1>
            {isDemoMode && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                Demo Mode
              </span>
            )}
          </div>
        </div>
        {!isDemoMode && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
          >
            + Log Workout
          </button>
        )}
      </div>

      {/* Weekly chart */}
      <WeeklyView weekOffset={weekOffset} onWeekChange={setWeekOffset} />

      {/* Monthly calendar */}
      <div className="mt-8">
        <MonthlyView monthOffset={monthOffset} onMonthChange={setMonthOffset} />
      </div>

      {/* Log form (shown when button clicked) */}
      {showForm && (
        <WorkoutForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {/* Workout list */}
      <div className="space-y-3">
        {workouts.length === 0 && (
          <p className="text-center text-gray-400 mt-16">
            No workouts yet — hit <strong>+ Log Workout</strong> to add your
            first one!
          </p>
        )}
        {[...workouts].reverse().map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
          >
            <div
              className="w-3 h-10 rounded-full flex-shrink-0"
              style={{ backgroundColor: categoryColor(w.category) }}
            />
            <div>
              <p className="font-medium text-gray-800">{w.activityName}</p>
              <p className="text-sm text-gray-500">
                {w.date} · {w.durationMinutes} min · {w.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function categoryColor(category: string) {
  const colors: Record<string, string> = {
    Swim: '#87CEEB',
    Bike: '#FF8C00',
    Hike: '#4CAF50',
    Gym: '#7B2D8B',
    Yoga: '#E91E8C',
    Other: '#607D8B',
  };
  return colors[category] ?? '#607D8B';
}

export default App;
