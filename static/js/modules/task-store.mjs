export const STORAGE_KEY = "taskify.tasks.v1";

export const DEFAULT_TASKS = [
  {
    id: "seed-audit",
    title: "Audit task persistence",
    details: "Create a task, refresh the dashboard, and confirm that the saved card is restored.",
    status: "todo",
    priority: "high",
    owner: "Coursework team",
    dueDate: "",
    createdAt: "2026-05-08T00:00:00.000Z",
  },
  {
    id: "seed-validation",
    title: "Check validation warnings",
    details: "Try an empty title and a duplicate task to verify that invalid data is rejected.",
    status: "doing",
    priority: "medium",
    owner: "Coursework team",
    dueDate: "",
    createdAt: "2026-05-08T00:00:00.000Z",
  },
];

const VALID_STATUSES = ["todo", "doing", "done"];
const VALID_PRIORITIES = ["high", "medium", "low"];

export function normaliseText(value, maxLength = 240) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function validateTaskInput(input, limits = { maxTitleLength: 80, maxDetailsLength: 240 }) {
  const title = normaliseText(input.title, limits.maxTitleLength);
  const details = normaliseText(input.details, limits.maxDetailsLength);
  const owner = normaliseText(input.owner, 40);
  const status = VALID_STATUSES.includes(input.status) ? input.status : "todo";
  const priority = VALID_PRIORITIES.includes(input.priority) ? input.priority : "medium";
  const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(String(input.dueDate || "")) ? String(input.dueDate) : "";

  if (!title) {
    return { ok: false, reason: "missing-title" };
  }

  return {
    ok: true,
    value: { title, details, owner, status, priority, dueDate },
  };
}

export function createTask(input, limits) {
  const validation = validateTaskInput(input, limits);

  if (!validation.ok) {
    return validation;
  }

  return {
    ok: true,
    value: {
      id: input.id || `task-${Math.random().toString(36).slice(2, 10)}`,
      createdAt: input.createdAt || new Date().toISOString(),
      ...validation.value,
    },
  };
}

export function upsertTask(tasks, task) {
  const index = tasks.findIndex((item) => item.id === task.id);

  if (index === -1) {
    return [task, ...tasks];
  }

  const updated = tasks.slice();
  updated[index] = task;
  return updated;
}

export function deleteTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

export function updateTaskStatus(tasks, taskId, status) {
  const nextStatus = VALID_STATUSES.includes(status) ? status : "todo";
  return tasks.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task));
}

export function isDuplicateTask(tasks, candidate) {
  return tasks.some(
    (task) =>
      task.id !== candidate.id &&
      task.title.toLowerCase() === candidate.title.toLowerCase() &&
      task.details.toLowerCase() === candidate.details.toLowerCase()
  );
}

export function filterTasks(tasks, filters) {
  const query = normaliseText(filters.search, 80).toLowerCase();

  return tasks.filter((task) => {
    const matchesQuery =
      query === "" ||
      task.title.toLowerCase().includes(query) ||
      task.details.toLowerCase().includes(query) ||
      task.owner.toLowerCase().includes(query);

    const matchesStatus = filters.status === "all" || task.status === filters.status;
    const matchesPriority = filters.priority === "all" || task.priority === filters.priority;

    return matchesQuery && matchesStatus && matchesPriority;
  });
}

export function groupTasks(tasks) {
  return {
    todo: tasks.filter((task) => task.status === "todo"),
    doing: tasks.filter((task) => task.status === "doing"),
    done: tasks.filter((task) => task.status === "done"),
  };
}

export function getMetrics(tasks) {
  return {
    total: tasks.length,
    doing: tasks.filter((task) => task.status === "doing").length,
    done: tasks.filter((task) => task.status === "done").length,
  };
}

export function safeLoadTasks(storage) {
  try {
    const raw = storage?.getItem?.(STORAGE_KEY);

    if (!raw) {
      return { ok: true, tasks: DEFAULT_TASKS };
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return { ok: false, tasks: DEFAULT_TASKS };
    }

    const tasks = parsed.map((task) => createTask(task).value).filter(Boolean);
    return { ok: true, tasks };
  } catch (error) {
    return { ok: false, tasks: DEFAULT_TASKS };
  }
}

export function persistTasks(storage, tasks) {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
