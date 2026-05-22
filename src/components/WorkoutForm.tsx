import { useState } from 'react';
import { saveWorkout } from '../storage';

const CATEGORIES = ['Swim', 'Bike', 'Hike', 'Gym', 'Yoga', 'Other'];
const INTENSITIES = ['Easy', 'Moderate', 'Hard'];

const categoryColors: Record<string, string> = {
  Swim: '#87CEEB',
  Bike: '#FF8C00',
  Hike: '#4CAF50',
  Gym: '#7B2D8B',
  Yoga: '#E91E8C',
  Other: '#607D8B',
};

interface Props {
  onSave: () => void;
  onCancel: () => void;
}

export default function WorkoutForm({ onSave, onCancel }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    date: today,
    category: 'Gym',
    activityName: '',
    durationMinutes: '',
    intensity: 'Moderate',
    notes: '',
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    if (!form.activityName || !form.durationMinutes) {
      alert('Please fill in Activity Name and Duration before saving.');
      return;
    }
    saveWorkout({
      ...form,
      durationMinutes: Number(form.durationMinutes),
    });
    onSave();
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Log a Workout
      </h2>

      <div className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setForm({ ...form, category: cat })}
                className="px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all"
                style={{
                  backgroundColor:
                    form.category === cat ? categoryColors[cat] : 'white',
                  borderColor: categoryColors[cat],
                  color: form.category === cat ? 'white' : '#374151',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Activity Name
          </label>
          <input
            type="text"
            name="activityName"
            value={form.activityName}
            onChange={handleChange}
            placeholder="e.g. Hot Yoga, Deadlift Day, Tiger Mountain"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="durationMinutes"
            value={form.durationMinutes}
            onChange={handleChange}
            placeholder="e.g. 45"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Intensity */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Intensity (optional)
          </label>
          <select
            name="intensity"
            value={form.intensity}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            {INTENSITIES.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="e.g. New PR, felt strong, great views"
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Save Workout
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

