import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getWorkouts } from '../storage';

const CATEGORIES = ['Swim', 'Bike', 'Hike', 'Gym', 'Yoga', 'Other'];
const categoryColors: Record<string, string> = {
  Swim: '#87CEEB',
  Bike: '#FF8C00',
  Hike: '#4CAF50',
  Gym: '#7B2D8B',
  Yoga: '#E91E8C',
  Other: '#607D8B',
};

interface Props {
  weekOffset: number;
  onWeekChange: (offset: number) => void;
}

export default function WeeklyView({ weekOffset, onWeekChange }: Props) {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + weekOffset * 7);

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const workouts = getWorkouts();

  // Build chart data
  const chartData = daysOfWeek.map((dateStr, idx) => {
    const dayWorkouts = workouts.filter((w) => w.date === dateStr);
    const data: Record<string, number> = {
      date: dayLabels[idx],
    };

    CATEGORIES.forEach((cat) => {
      const mins = dayWorkouts
        .filter((w) => w.category === cat)
        .reduce((sum, w) => sum + w.durationMinutes, 0);
      if (mins > 0) data[cat] = mins;
    });

    return data;
  });

  const totalMinutes = workouts
    .filter((w) => daysOfWeek.includes(w.date))
    .reduce((sum, w) => sum + w.durationMinutes, 0);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">This Week</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onWeekChange(weekOffset - 1)}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
          >
            ← Prev
          </button>
          <button
            onClick={() => onWeekChange(weekOffset + 1)}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
          >
            Next →
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          {CATEGORIES.map((cat) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="a"
              fill={categoryColors[cat]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{totalMinutes}</span>{' '}
          minutes this week
        </p>
      </div>
    </div>
  );
}
