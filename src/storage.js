const STORAGE_KEY = 'move_workouts';

export function getWorkouts() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveWorkout(entry) {
  const workouts = getWorkouts();
  const newEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  workouts.push(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  return newEntry;
}

export function deleteWorkout(id) {
  const workouts = getWorkouts().filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

export function updateWorkout(id, changes) {
  const workouts = getWorkouts().map((w) =>
    w.id === id ? { ...w, ...changes } : w
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

export function exportData() {
  const workouts = getWorkouts();
  const blob = new Blob([JSON.stringify(workouts, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'move_workouts_backup.json';
  a.click();
  URL.revokeObjectURL(url);
}
