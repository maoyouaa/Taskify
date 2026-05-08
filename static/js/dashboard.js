import { persistTasks, safeLoadTasks } from "./modules/task-store.mjs";

function t(key) {
  return window.TaskifyI18n ? window.TaskifyI18n.t(key) : key;
}

const seedTasks = [
  {
    id: "task-1",
    title: "Review landing page copy",
    details: "Tighten the first-screen message before the internal demo.",
    status: "todo",
    priority: "high",
    owner: "Member A",
    dueDate: "2026-05-12",
  },
  {
    id: "task-2",
    title: "Prepare sprint check-in",
    details: "Summarize blockers and current progress for the team update.",
    status: "doing",
    priority: "medium",
    owner: "Member C",
    dueDate: "2026-05-10",
  },
  {
    id: "task-3",
    title: "Archive resolved bug list",
    details: "Move last week's completed fixes into the release notes.",
    status: "done",
    priority: "low",
    owner: "Member B",
    dueDate: "",
  },
];

const form = document.getElementById("task-form");
const boardGrid = document.getElementById("board-grid");
const message = document.getElementById("form-message");
const submitButton = document.getElementById("submit-button");
const resetButton = document.getElementById("reset-button");
const metrics = {
  total: document.getElementById("metric-total"),
  doing: document.getElementById("metric-doing"),
  done: document.getElementById("metric-done"),
};

let state = {
  tasks: safeLoadTasks(window.localStorage, seedTasks.map((task) => ({ ...task }))).tasks,
};

function showMessage(text, tone = "neutral") {
  message.textContent = text;
  message.classList.toggle("is-error", tone === "error");
}

function resetForm() {
  form.reset();
  form.elements.taskId.value = "";
  form.elements.status.value = "todo";
  form.elements.priority.value = "high";
  submitButton.textContent = t("dashboard.saveTask");
}

function fillForm(task) {
  form.elements.taskId.value = task.id;
  form.elements.title.value = task.title;
  form.elements.details.value = task.details;
  form.elements.status.value = task.status;
  form.elements.priority.value = task.priority;
  form.elements.owner.value = task.owner;
  form.elements.dueDate.value = task.dueDate;
  submitButton.textContent = t("dashboard.updateTask");
}

function getMetrics(tasks) {
  return {
    total: tasks.length,
    doing: tasks.filter((task) => task.status === "doing").length,
    done: tasks.filter((task) => task.status === "done").length,
  };
}

function createActionButton(text, handler, variant = "secondary") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = variant === "primary" ? "task-action task-action-primary" : `task-action task-action-${variant}`;
  button.textContent = text;
  button.addEventListener("click", handler);
  return button;
}

function persistState() {
  persistTasks(window.localStorage, state.tasks);
}

function saveTask(task) {
  const existingIndex = state.tasks.findIndex((item) => item.id === task.id);

  if (existingIndex === -1) {
    state.tasks = [task, ...state.tasks];
    showMessage(t("dashboard.taskSaved"));
  } else {
    const nextTasks = state.tasks.slice();
    nextTasks[existingIndex] = task;
    state.tasks = nextTasks;
    showMessage(t("dashboard.taskUpdated"));
  }

  persistState();
  renderBoard();
  resetForm();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  persistState();

  if (form.elements.taskId.value === taskId) {
    resetForm();
  }

  renderBoard();
  showMessage(t("dashboard.taskDeleted"));
}

function moveTask(taskId, nextStatus, messageText) {
  state.tasks = state.tasks.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task));
  persistState();
  renderBoard();
  showMessage(messageText);
}

function renderTask(task) {
  const card = document.createElement("article");
  card.className = "task-card";

  const header = document.createElement("div");
  header.className = "task-card-header";

  const title = document.createElement("h3");
  title.textContent = task.title;

  const priority = document.createElement("span");
  priority.className = `priority-chip priority-${task.priority}`;
  priority.textContent = t(`dashboard.priority.${task.priority}`);

  header.append(title, priority);

  const details = document.createElement("p");
  details.textContent = task.details || t("dashboard.noDetails");

  const meta = document.createElement("div");
  meta.className = "task-meta";

  if (task.owner) {
    const owner = document.createElement("span");
    owner.textContent = `${t("dashboard.owner")}: ${task.owner}`;
    meta.appendChild(owner);
  }

  if (task.dueDate) {
    const due = document.createElement("span");
    due.textContent = `${t("dashboard.due")}: ${task.dueDate}`;
    meta.appendChild(due);
  }

  const actions = document.createElement("div");
  actions.className = "task-actions";

  actions.append(
    createActionButton(t("dashboard.edit"), () => {
      fillForm(task);
      form.elements.title.focus();
      showMessage(t("dashboard.taskLoaded"));
    })
  );

  if (task.status === "todo") {
    actions.append(createActionButton(t("dashboard.start"), () => moveTask(task.id, "doing", t("dashboard.taskMovedDoing")), "primary"));
  }

  if (task.status === "doing") {
    actions.append(createActionButton(t("dashboard.complete"), () => moveTask(task.id, "done", t("dashboard.taskMovedDone")), "primary"));
  }

  if (task.status === "done") {
    actions.append(createActionButton(t("dashboard.reset"), () => moveTask(task.id, "todo", t("dashboard.taskMovedTodo"))));
  }

  actions.append(createActionButton(t("dashboard.delete"), () => deleteTask(task.id), "danger"));

  card.append(header, details, meta, actions);
  return card;
}

function renderBoard() {
  const grouped = {
    todo: state.tasks.filter((task) => task.status === "todo"),
    doing: state.tasks.filter((task) => task.status === "doing"),
    done: state.tasks.filter((task) => task.status === "done"),
  };

  const columns = [
    { key: "todo", title: labels.todo },
    { key: "doing", title: labels.doing },
    { key: "done", title: labels.done },
  ];

  boardGrid.replaceChildren();

  columns.forEach((column) => {
    const section = document.createElement("section");
    section.className = "board-column";
    section.setAttribute("aria-labelledby", `${column.key}-heading`);

    const header = document.createElement("div");
    header.className = "board-column-header";

    const heading = document.createElement("h3");
    heading.id = `${column.key}-heading`;
    heading.textContent = column.title;

    const count = document.createElement("span");
    count.className = "board-column-count";
    count.textContent = String(grouped[column.key].length);

    header.append(heading, count);
    section.appendChild(header);

    if (grouped[column.key].length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = t("dashboard.emptyState");
      section.appendChild(empty);
    } else {
      grouped[column.key].forEach((task) => section.appendChild(renderTask(task)));
    }

    boardGrid.appendChild(section);
  });

  const nextMetrics = getMetrics(state.tasks);
  metrics.total.textContent = String(nextMetrics.total);
  metrics.doing.textContent = String(nextMetrics.doing);
  metrics.done.textContent = String(nextMetrics.done);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    showMessage(t("dashboard.formInvalid"), "error");
    return;
  }

  const taskId = form.elements.taskId.value || `task-${Date.now()}`;
  const task = {
    id: taskId,
    title: form.elements.title.value.trim(),
    details: form.elements.details.value.trim(),
    status: form.elements.status.value,
    priority: form.elements.priority.value,
    owner: form.elements.owner.value.trim(),
    dueDate: form.elements.dueDate.value,
  };

  saveTask(task);
});

resetButton.addEventListener("click", () => {
  resetForm();
  showMessage(t("dashboard.formCleared"));
});

window.addEventListener("taskify:languagechange", () => {
  renderBoard();
  submitButton.textContent = form.elements.taskId.value ? t("dashboard.updateTask") : t("dashboard.saveTask");
  showMessage(t("dashboard.workspaceReady"));
});

renderBoard();
