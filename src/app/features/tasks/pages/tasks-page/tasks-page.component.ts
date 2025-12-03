import { Component, inject } from '@angular/core';
import { TasksListComponent } from '../../components/tasks-list/tasks-list.component';
import { TASKS_STORE } from '../../store/tasks.store';
import { TasksAddComponent } from '../../components/tasks-add/tasks-add.component';
import { TasksFiltersComponent } from '../../components/tasks-filters/tasks-filters.component';

@Component({
  selector: 'app-tasks-page',
  imports: [TasksListComponent, TasksAddComponent, TasksFiltersComponent],
  template: `
    <section class="tasks-page">
      <header class="tasks-pahe__header">
        <h1>Tasks Board</h1>
        <p class="tasks-page__subtitle">Mini-store con signals, scoped por feature.</p>
      </header>
      <main class="tasks-page__content">
        <button type="button" (click)="store.loadFromApi()" [disabled]="store.loading()">
          {{ store.loading() ? 'Cargando...' : 'Cargar desde API' }}
        </button>

        @if (store.error()) {
        <p style="color:red;">Error: {{ store.error() }}</p>
        }

        <app-tasks-add />
        <app-tasks-filters />
        <app-tasks-list />
      </main>
    </section>
  `,
  styles: ``,
})
export class TasksPageComponent {
  readonly store = inject(TASKS_STORE);
}
