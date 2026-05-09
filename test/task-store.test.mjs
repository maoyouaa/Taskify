import assert from "node:assert/strict";
import test from "node:test";
import { persistTasks, safeLoadTasks, STORAGE_KEY } from "../static/js/modules/task-store.mjs";

function createStorage(initialValues = {}) {
  const data = new Map(Object.entries(initialValues));

  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    valueFor(key) {
      return data.get(key);
    },
  };
}

test("safeLoadTasks returns fallback tasks when storage is empty", () => {
  const fallbackTasks = [{ id: "task-1", title: "Fallback task" }];
  const result = safeLoadTasks(createStorage(), fallbackTasks);

  assert.deepEqual(result, { ok: true, tasks: fallbackTasks });
});

test("safeLoadTasks returns stored tasks when saved JSON is valid", () => {
  const storedTasks = [{ id: "task-2", title: "Stored task" }];
  const storage = createStorage({
    [STORAGE_KEY]: JSON.stringify(storedTasks),
  });

  const result = safeLoadTasks(storage, []);

  assert.deepEqual(result, { ok: true, tasks: storedTasks });
});

test("safeLoadTasks falls back when saved JSON is not an array", () => {
  const fallbackTasks = [{ id: "task-3", title: "Fallback task" }];
  const storage = createStorage({
    [STORAGE_KEY]: JSON.stringify({ id: "task-3" }),
  });

  const result = safeLoadTasks(storage, fallbackTasks);

  assert.deepEqual(result, { ok: false, tasks: fallbackTasks });
});

test("safeLoadTasks falls back when saved JSON cannot be parsed", () => {
  const fallbackTasks = [{ id: "task-4", title: "Fallback task" }];
  const storage = createStorage({
    [STORAGE_KEY]: "{not-json",
  });

  const result = safeLoadTasks(storage, fallbackTasks);

  assert.deepEqual(result, { ok: false, tasks: fallbackTasks });
});

test("persistTasks writes the task list to the dashboard storage key", () => {
  const storage = createStorage();
  const tasks = [{ id: "task-5", title: "Persisted task" }];

  persistTasks(storage, tasks);

  assert.equal(storage.valueFor(STORAGE_KEY), JSON.stringify(tasks));
});
