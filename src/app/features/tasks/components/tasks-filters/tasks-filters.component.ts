import { Component, inject } from '@angular/core';
import { TASKS_STORE } from '../../store/tasks.store';

@Component({
  selector: 'app-tasks-filters',
  imports: [],
  template: `
    <section class="tasks-filters">
      <div class="tasks-filters__buttons">
        <button
          type="button"
          [class.active]="store.filter() === 'all'"
          (click)="store.setFilter('all')"
        >
          Todas
        </button>

        <button
          type="button"
          [class.active]="store.filter() === 'completed'"
          (click)="store.setFilter('completed')"
        >
          Completadas
        </button>

        <button
          type="button"
          [class.active]="store.filter() === 'pending'"
          (click)="store.setFilter('pending')"
        >
          Pendientes
        </button>
      </div>

      <div class="tasks-filters__actions">
        <button type="button" (click)="store.clearCompleted()">Limpiar completadas</button>

        <button type="button" (click)="store.clearAll()">Limpiar todas</button>
      </div>

      <div class="tasks-filters__summary">
        {{ store.count().done }} / {{ store.count().total }} completadas
      </div>
    </section>
  `,
  styles: [
    `
      .tasks-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1rem;
      }

      .tasks-filters__buttons {
        display: flex;
        gap: 0.5rem;
      }

      .tasks-filters__actions {
        display: flex;
        gap: 0.5rem;
        margin-left: auto;
      }

      button.active {
        font-weight: bold;
        text-decoration: underline;
      }

      .tasks-filters__summary {
        font-size: 0.9rem;
        opacity: 0.8;
        width: 100%;
      }
    `,
  ],
})
export class TasksFiltersComponent {
  readonly store = inject(TASKS_STORE);
}
