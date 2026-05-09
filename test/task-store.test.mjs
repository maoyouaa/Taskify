import assert from "node:assert/strict";
import test from "node:test";

import { persistTasks, safeLoadTasks, STORAGE_KEY } from "../static/js/modules/task-store.mjs";

function createStorage(initialValue) {
  const store = new Map();

  if (typeof initialValue !== "undefined") {
    store.set(STORAGE_KEY, initialValue);
  }

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
  };
}

test("safeLoadTasks returns fallback tasks when nothing has been saved", () => {
  const fallbackTasks = [{ id: "task-1", title: "Fallback task" }];
  const storage = createStorage();

  const result = safeLoadTasks(storage, fallbackTasks);

  assert.equal(result.ok, true);
  assert.deepEqual(result.tasks, fallbackTasks);
});

test("persistTasks writes JSON that safeLoadTasks can restore", () => {
  const tasks = [
    { id: "task-1", title: "Review copy", status: "todo" },
    { id: "task-2", title: "Prepare notes", status: "doing" },
  ];
  const storage = createStorage();

  persistTasks(storage, tasks);
  const result = safeLoadTasks(storage, []);

  assert.equal(storage.getItem(STORAGE_KEY), JSON.stringify(tasks));
  assert.equal(result.ok, true);
  assert.deepEqual(result.tasks, tasks);
});

test("safeLoadTasks falls back cleanly when saved data is invalid JSON", () => {
  const fallbackTasks = [{ id: "task-1", title: "Fallback task" }];
  const storage = createStorage("{not valid json");

  const result = safeLoadTasks(storage, fallbackTasks);

  assert.equal(result.ok, false);
  assert.deepEqual(result.tasks, fallbackTasks);
});

test("safeLoadTasks falls back when saved data is not an array", () => {
  const fallbackTasks = [{ id: "task-1", title: "Fallback task" }];
  const storage = createStorage(JSON.stringify({ id: "task-1" }));

  const result = safeLoadTasks(storage, fallbackTasks);

  assert.equal(result.ok, false);
  assert.deepEqual(result.tasks, fallbackTasks);
});
