# Deficiency: Dashboard task state was lost on page refresh

## Where the flaw came from

The flaw was in `static/js/dashboard.js`. Before the fix, the dashboard task
board only initialized its state from in-memory seed data:

```js
let state = {
  tasks: seedTasks.map((task) => ({ ...task })),
};
```

That meant every task change lived only in the current browser session. If the
user refreshed the page, the board rebuilt itself from the original defaults and
discarded the user's latest edits.

## How the flaw was found

I found it through manual workflow testing on `/dashboard`. After adding or
editing a task, refreshing the page restored the board to the default seeded
state instead of keeping the user's latest task list.

I then confirmed the cause in source inspection. The board logic updated
`state.tasks` during saves, deletes, and status moves, but there was no
persistent storage step connected to those actions and no storage restore during
initial page load.

The current persistence evidence is stored in:

- `docs/pr4/evidence/persistence-after-refresh.png`
- `docs/pr4/evidence/persistence-check.txt`

## Literature review

MDN's Web Storage API documentation explains that `localStorage` keeps string
data across browser sessions for the same origin, which makes it suitable for
small client-side state that should survive refreshes and browser restarts [1].

web.dev's storage guidance makes the same practical point from an engineering
perspective: small structured UI state can be serialized and restored locally,
provided the application safely handles missing or malformed stored data [2].

That research led to two concrete design requirements for this fix:

1. store the task array whenever the board state changes
2. safely recover if stored data is absent or invalid, instead of crashing the
   dashboard

Report-ready references in IEEE style:

[1] MDN Web Docs, "Window: localStorage property." [Online]. Available:
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage Accessed:
May 9, 2026.

[2] web.dev, "The storage for the web." [Online]. Available:
https://web.dev/storage-for-the-web/ Accessed: May 9, 2026.

## Implementation rationale

The implementation separates persistence from board rendering by introducing a
small storage module in `static/js/modules/task-store.mjs`.

Before:

```js
let state = {
  tasks: seedTasks.map((task) => ({ ...task })),
};
```

After:

```js
let state = {
  tasks: safeLoadTasks(window.localStorage, seedTasks.map((task) => ({ ...task }))).tasks,
};
```

The storage module now handles both save and restore:

```js
export function persistTasks(storage, tasks) {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
```

```js
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
```

The research directly informed the code in two ways:

- `persistTasks(...)` serializes the latest task array after saves, deletes, and
  status moves, so refreshes do not discard user actions.
- `safeLoadTasks(...)` wraps the restore path in validation and fallback logic,
  so broken JSON or the wrong data shape returns to seeded defaults instead of
  breaking the dashboard.

## Before and after evidence

- Before: the board state was rebuilt from `seedTasks` only, so refresh lost
  user changes.
- After: a task injected into `localStorage` remains visible after reload, as
  shown in `docs/pr4/evidence/persistence-after-refresh.png`.
- The storage proof in `docs/pr4/evidence/persistence-check.txt` records the
  persisted payload and confirms that the reloaded page still rendered the saved
  task.

## Verification

- `npm test`
- `test/task-store.test.mjs` verifies missing storage, valid restore, invalid
  JSON fallback, and wrong-shape fallback
- `docs/pr4/evidence/persistence-after-refresh.png` confirms that a stored task
  remains visible after page reload
- `docs/pr4/evidence/persistence-check.txt` records the restored task title and
  serialized storage payload
