import {
  createTask,
  deleteTask,
  filterTasks,
  getMetrics,
  groupTasks,
  isDuplicateTask,
  persistTasks,
  safeLoadTasks,
  updateTaskStatus,
  upsertTask,
} from "./modules/task-store.mjs";

const labels = {
  todo: "To do",
  doing: "In progress",
  done: "Completed",
  high: "High",
  medium: "Medium",
  low: "Low",
  edit: "Edit",
  delete: "Delete",
  start: "Start",
  complete: "Complete",
  reset: "Reset",
};

const form = document.getElementById("task-form");
const boardGrid = document.getElementById("board-grid");
const message = document.getElementById("form-message");
const submitButton = document.getElementById("submit-button");
const resetButton = document.getElementById("reset-button");
const filterForm = document.getElementById("filter-form");
const metrics = {
  total: document.getElementById("metric-total"),
  doing: document.getElementById("metric-doing"),
  done: document.getElementById("metric-done"),
};

let state = {
  tasks: [],
  filters: { search: "", status: "all", priority: "all" },
};

function showMessage(text, tone = "neutral") {
  message.textContent = text;
  message.classList.toggle("is-error", tone === "error");
}

function fillForm(task) {
  form.elements.taskId.value = task?.id || "";
  form.elements.title.value = task?.title || "";
  form.elements.details.value = task?.details || "";
  form.elements.status.value = task?.status || "todo";
  form.elements.priority.value = task?.priority || "high";
  form.elements.owner.value = task?.owner || "";
  form.elements.dueDate.value = task?.dueDate || "";
  submitButton.textContent = task ? "Update task" : "Save task";
}

function resetForm() {
  form.reset();
  form.elements.taskId.value = "";
  form.elements.status.value = "todo";
  form.elements.priority.value = "high";
  submitButton.textContent = "Save task";
}

function createActionButton(text, handler, variant = "secondary") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `task-action task-action-${variant}`;
  button.textContent = text;
  button.addEventListener("click", handler);
  return button;
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
  priority.textContent = labels[task.priority];

  header.append(title, priority);

  const details = document.createElement("p");
  details.textContent = task.details || "No details added.";

  const meta = document.createElement("div");
  meta.className = "task-meta";

  if (task.owner) {
    const owner = document.createElement("span");
    owner.textContent = `Owner: ${task.owner}`;
    meta.appendChild(owner);
  }

  if (task.dueDate) {
    const due = document.createElement("span");
    due.textContent = `Due: ${task.dueDate}`;
    meta.appendChild(due);
  }

  const actions = document.createElement("div");
  actions.className = "task-actions";

  actions.append(
    createActionButton(labels.edit, () => {
      fillForm(task);
      form.elements.title.focus();
      showMessage("Task loaded for editing.");
    })
  );

  if (task.status === "todo") {
    actions.append(createActionButton(labels.start, () => moveTask(task.id, "doing", "Task moved to In progress.")));
  }

  if (task.status === "doing") {
    actions.append(createActionButton(labels.complete, () => moveTask(task.id, "done", "Task moved to Completed.")));
  }

  if (task.status === "done") {
    actions.append(createActionButton(labels.reset, () => moveTask(task.id, "todo", "Task moved to To do.")));
  }

  actions.append(
    createActionButton(
      labels.delete,
      () => {
        const nextTasks = deleteTask(state.tasks, task.id);
        saveTasks(nextTasks, "Task deleted successfully.");

        if (form.elements.taskId.value === task.id) {
          resetForm();
        }
      },
      "danger"
    )
  );

  card.append(header, details, meta, actions);
  return card;
}

function renderBoard() {
  const filtered = filterTasks(state.tasks, state.filters);
  const grouped = groupTasks(filtered);
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
      empty.textContent = "No tasks match the current filters.";
      section.appendChild(empty);
    } else {
      grouped[column.key].forEach((task) => section.appendChild(renderTask(task)));
    }

    boardGrid.appendChild(section);
  });

  const metricState = getMetrics(state.tasks);
  metrics.total.textContent = String(metricState.total);
  metrics.doing.textContent = String(metricState.doing);
  metrics.done.textContent = String(metricState.done);
}

function saveTasks(tasks, messageText) {
  try {
    persistTasks(window.localStorage, tasks);
    state.tasks = tasks;
    renderBoard();
    showMessage(messageText);
  } catch (error) {
    showMessage("Task changes could not be saved locally.", "error");
  }
}

function moveTask(taskId, nextStatus, messageText) {
  saveTasks(updateTaskStatus(state.tasks, taskId, nextStatus), messageText);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskId = form.elements.taskId.value;
  const result = createTask({
    id: taskId,
    title: form.elements.title.value,
    details: form.elements.details.value,
    status: form.elements.status.value,
    priority: form.elements.priority.value,
    owner: form.elements.owner.value,
    dueDate: form.elements.dueDate.value,
  });

  if (!result.ok) {
    showMessage("Please add a task title before saving.", "error");
    return;
  }

  if (isDuplicateTask(state.tasks, result.value)) {
    showMessage("A task with the same title and details already exists.", "error");
    return;
  }

  saveTasks(upsertTask(state.tasks, result.value), taskId ? "Task updated successfully." : "Task saved successfully.");
  resetForm();
});

resetButton.addEventListener("click", () => {
  resetForm();
  showMessage("Form cleared.");
});

filterForm.addEventListener("input", () => {
  state.filters = {
    search: filterForm.elements.search.value,
    status: filterForm.elements.status.value,
    priority: filterForm.elements.priority.value,
  };
  renderBoard();
});

const loaded = safeLoadTasks(window.localStorage);
state.tasks = loaded.tasks;
renderBoard();
showMessage(loaded.ok ? "Workspace ready. Saved tasks will persist after refresh." : "Saved tasks could not be read, so defaults were loaded.", loaded.ok ? "neutral" : "error");
