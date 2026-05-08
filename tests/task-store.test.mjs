import assert from "node:assert/strict";
import test from "node:test";
import {
  createTask,
  deleteTask,
  filterTasks,
  getMetrics,
  groupTasks,
  isDuplicateTask,
  normaliseText,
  safeLoadTasks,
  updateTaskStatus,
  upsertTask,
  validateTaskInput,
} from "../static/js/modules/task-store.mjs";

test("normalises repeated whitespace and trims values", () => {
  assert.equal(normaliseText("  hello   world  ", 20), "hello world");
});

test("rejects empty task titles", () => {
  assert.equal(validateTaskInput({ title: "   " }).ok, false);
});

test("creates validated tasks with safe defaults", () => {
  const result = createTask({
    title: "  Review  PR  ",
    details: "<script>alert(1)</script>",
    status: "doing",
    priority: "high",
    owner: "Member A",
    dueDate: "2026-05-08",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.title, "Review PR");
  assert.equal(result.value.details, "<script>alert(1)</script>");
  assert.equal(result.value.status, "doing");
  assert.equal(result.value.priority, "high");
});

test("upserts and deletes tasks deterministically", () => {
  const original = [{ id: "a", title: "One", details: "", status: "todo", priority: "low", owner: "", dueDate: "", createdAt: "x" }];
  const inserted = upsertTask(original, { id: "b", title: "Two", details: "", status: "done", priority: "high", owner: "", dueDate: "", createdAt: "y" });
  assert.equal(inserted.length, 2);

  const updated = upsertTask(inserted, { ...inserted[0], title: "Updated" });
  assert.equal(updated[0].title, "Updated");
  assert.equal(deleteTask(updated, "a").length, 1);
});

test("updates task status and groups correctly", () => {
  const tasks = [
    { id: "a", title: "One", details: "", status: "todo", priority: "low", owner: "", dueDate: "", createdAt: "x" },
    { id: "b", title: "Two", details: "", status: "doing", priority: "high", owner: "", dueDate: "", createdAt: "y" },
  ];

  const moved = updateTaskStatus(tasks, "a", "done");
  const grouped = groupTasks(moved);

  assert.equal(grouped.done.length, 1);
  assert.equal(grouped.todo.length, 0);
});

test("filters by query, status, and priority", () => {
  const tasks = [
    { id: "a", title: "Accessibility audit", details: "labels", status: "todo", priority: "high", owner: "B", dueDate: "", createdAt: "x" },
    { id: "b", title: "Privacy policy", details: "cookies", status: "done", priority: "medium", owner: "C", dueDate: "", createdAt: "y" },
  ];

  assert.equal(filterTasks(tasks, { search: "privacy", status: "all", priority: "all" }).length, 1);
  assert.equal(filterTasks(tasks, { search: "", status: "done", priority: "medium" }).length, 1);
  assert.equal(filterTasks(tasks, { search: "", status: "doing", priority: "all" }).length, 0);
});

test("detects duplicates by title and details", () => {
  const tasks = [
    { id: "a", title: "Write report", details: "Section 2", status: "todo", priority: "high", owner: "", dueDate: "", createdAt: "x" },
  ];

  assert.equal(isDuplicateTask(tasks, { id: "b", title: "write report", details: "section 2" }), true);
  assert.equal(isDuplicateTask(tasks, { id: "b", title: "write report", details: "section 3" }), false);
});

test("loads defaults when storage is empty or malformed", () => {
  const emptyStorage = { getItem: () => null };
  const malformedStorage = { getItem: () => "not-json" };

  assert.ok(safeLoadTasks(emptyStorage).tasks.length > 0);
  assert.equal(safeLoadTasks(malformedStorage).ok, false);
});

test("calculates metrics from task state", () => {
  const metrics = getMetrics([{ status: "todo" }, { status: "doing" }, { status: "done" }, { status: "done" }]);

  assert.deepEqual(metrics, { total: 4, doing: 1, done: 2 });
});
