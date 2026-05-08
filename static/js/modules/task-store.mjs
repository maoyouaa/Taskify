export const STORAGE_KEY = "taskify.dashboard.tasks";

export function safeLoadTasks(storage, fallbackTasks = []) {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (!saved) {
      return { ok: true, tasks: fallbackTasks };
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return { ok: false, tasks: fallbackTasks };
    }

    return { ok: true, tasks: parsed };
  } catch (error) {
    return { ok: false, tasks: fallbackTasks };
  }
}

export function persistTasks(storage, tasks) {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
