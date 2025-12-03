import { computed, effect, InjectionToken, Provider, signal } from '@angular/core';

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

function createInitialTasks(): Task[] {
  return [
    { id: '1', title: 'Aprender signals en angular', done: false },
    { id: '2', title: 'Diseña arquitectura por features', done: false },
    { id: '3', title: 'Configurar scoped DI para tasks', done: false },
  ];
}

export function createTasksStore() {
  // STATE
  const tasks = signal<Task[]>(createInitialTasks());
  const filter = signal<'all' | 'completed' | 'pending'>('all');

  // SELECTORS
  const filtered = computed(() => {
    const f = filter();
    const list = tasks();

    if (f === 'completed') {
      return list.filter((task) => task.done);
    }
    if (f === 'pending') {
      return list.filter((task) => !task.done);
    }
    return list;
  });

  const count = computed(() => {
    total: tasks().length;
    done: tasks().filter((task) => task.done).length;
  });

  //ATCTIONS
  const add = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    tasks.update((list) => [...list, { id: crypto.randomUUID(), title: trimmed, done: false }]);
  };

  const toggle = (id: string) => {
    tasks.update((list) =>
      list.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  };

  const remove = (id: string) => {
    tasks.update((list) => list.filter((task) => task.id !== id));
  };

  const setFilter = (f: 'all' | 'completed' | 'pending') => {
    filter.set(f);
  };

  // EFFECTS
  effect(() => {
    console.log('[TasksStore] tasks changed:', tasks().length);
  });

  return {
    // state
    tasks,
    filter,

    // selectors
    filtered,
    count,

    // actions
    add,
    toggle,
    remove,
    setFilter,
  };
}

// Tipo del store expuesto en DI
export type TasksStore = ReturnType<typeof createTasksStore>;

// InjectionToken para el store
export const TASKS_STORE = new InjectionToken<TasksStore>('TasksStore');

// Helper para proveer el store en un scope (por ruta)
export function provideTasksStore(): Provider {
  return {
    provide: TASKS_STORE,
    useFactory: createTasksStore,
  };
}
