import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { TASKS_STORE } from './store/tasks.store';

export const tasksNotEmptyGuard: CanMatchFn = (route, segments: UrlSegment[]) => {
  const store = inject(TASKS_STORE, { optional: true });
  const router = inject(Router);

  // si por alguna razón no hay store, dejamos pasar
  if (!store) return true;

  // si no hay tareas, no tiene sentido ir a un detalle
  if (store.tasks().length === 0) {
    router.navigate(['/tasks']);
    return false;
  }

  return true;
};
