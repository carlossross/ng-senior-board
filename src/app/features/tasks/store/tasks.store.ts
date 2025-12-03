import { computed, effect, inject, InjectionToken, Provider, signal } from '@angular/core';
import { Task } from '../task.model';
import { TasksApiService } from '../tasks-api.service';
import { catchError, finalize, of, tap } from 'rxjs';

// function createInitialTasks(): Task[] {
//   return [
//     { id: '1', title: 'Aprender signals en angular', done: false },
//     { id: '2', title: 'Diseña arquitectura por features', done: false },
//     { id: '3', title: 'Configurar scoped DI para tasks', done: false },
//   ];
// }

const TASKS_STORAGE_KEY = 'ng-senior-board.tasks';

function loadInitialTasks(): Task[] {
  if (typeof localStorage === 'undefined') {
    // SSR / entornos raros, regresamos fallback
    return [
      { id: '1', title: 'Aprender signals en Angular', done: false },
      { id: '2', title: 'Diseñar arquitectura por features', done: false },
      { id: '3', title: 'Configurar scoped DI para tasks', done: false },
    ];
  }

  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      return [
        { id: '1', title: 'Aprender signals en Angular', done: false },
        { id: '2', title: 'Diseñar arquitectura por features', done: false },
        { id: '3', title: 'Configurar scoped DI para tasks', done: false },
      ];
    }

    const parsed = JSON.parse(raw) as Task[];
    // Validación simple
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function createTasksStore() {
  const api = inject(TasksApiService);

  // STATE
  const tasks = signal<Task[]>(loadInitialTasks());
  const filter = signal<'all' | 'completed' | 'pending'>('all');

  const loading = signal(false);
  const error = signal<string | null>(null);

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

  const count = computed(() => ({
    total: tasks().length,
    done: tasks().filter((task) => task.done).length,
  }));

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

  const clearCompleted = () => {
    tasks.update((list) => list.filter((t) => !t.done));
  };

  const clearAll = () => {
    tasks.set([]);
  };

  const update = (id: string, changes: Partial<Pick<Task, 'title' | 'done'>>) => {
    tasks.update((list) => list.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  };

  const loadFromApi = () => {
    loading.set(true);
    error.set(null);

    api
      .getTasks()
      .pipe(
        tap((response) => {
          tasks.set(response);
        }),
        catchError((err) => {
          error.set(err.message ?? 'Error cargando tareas');
          return of([]); // devolvemos lista vacía para fallback
        }),
        finalize(() => {
          loading.set(false);
        })
      )
      .subscribe();
  };

  // EFFECTS
  // effect(() => {
  //   console.log('[TasksStore] tasks changed:', tasks().length);
  // });

  effect(() => {
    const current = tasks();
    console.log('[TasksStore] tasks changed:', current.length);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(current));
    }
  });

  return {
    // state
    tasks,
    filter,
    loading,
    error,

    // selectors
    filtered,
    count,

    // actions
    add,
    toggle,
    remove,
    setFilter,
    clearCompleted,
    clearAll,
    update,
    loadFromApi,
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
