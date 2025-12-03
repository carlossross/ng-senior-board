import { Component, inject } from '@angular/core';
import { TasksListComponent } from '../../components/tasks-list/tasks-list.component';
import { TASKS_STORE } from '../../store/tasks.store';

@Component({
  selector: 'app-tasks-page',
  imports: [TasksListComponent],
  template: `
    <section class="tasks-page">
      <header class="tasks-pahe__header">
        <h1>Tasks Board</h1>
        <p class="tasks-page__subtitle">Mini-store con signals, scoped por feature.</p>
      </header>
      <main class="tasks-page__content">
        <app-tasks-list />
      </main>
    </section>
  `,
  styles: ``,
})
export class TasksPageComponent {
  private store = inject(TASKS_STORE, { optional: true });
}
