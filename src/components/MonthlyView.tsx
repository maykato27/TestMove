import { getWorkouts } from '../storage';

const categoryColors: Record<string, string> = {
  Swim: '#87CEEB',
  Bike: '#FF8C00',
  Hike: '#4CAF50',
  Gym: '#7B2D8B',
  Yoga: '#E91E8C',
  Other: '#607D8B',
};

interface Props {
  monthOffset: number;
  onMonthChange: (offset: number) => void;
}

export default function MonthlyView({ monthOffset, onMonthChange }: Props) {
  const today = new Date();
  const [year, month] = [today.getFullYear(), today.getMonth() + monthOffset];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const workouts = getWorkouts();
  const dayWorkoutMap: Record<string, string> = {};

  workouts.forEach((w) => {
    const [y, m, d] = w.date.split('-').map(Number);
    if (y === year && m === month + 1) {
      if (!dayWorkoutMap[d]) dayWorkoutMap[d] = w.category;
      else dayWorkoutMap[d] = 'Multi'; // Multiple categories on same day
    }
  });

  const monthName = new Date(year, month).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null); // Empty cells for days before month starts
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{monthName}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onMonthChange(monthOffset - 1)}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
          >
            ← Prev
          </button>
          <button
            onClick={() => onMonthChange(monthOffset + 1)}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-gray-500 py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const category = day ? dayWorkoutMap[day] : null;
          const color = category
            ? categoryColors[category as keyof typeof categoryColors]
            : null;

          return (
            <div
              key={idx}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                day ? 'cursor-pointer hover:shadow-md' : ''
              } ${color ? 'text-white' : 'text-gray-700 bg-gray-50'}`}
              style={{ backgroundColor: color || '#f9fafb' }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs font-semibold text-gray-600 mb-3">Categories</p>
        <div className="flex flex-wrap gap-3">
          {['Swim', 'Bike', 'Hike', 'Gym', 'Yoga', 'Other'].map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{
                  backgroundColor:
                    categoryColors[cat as keyof typeof categoryColors],
                }}
              />
              <span className="text-xs text-gray-600">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
