import { Component, inject } from '@angular/core';
import { TASKS_STORE } from '../../store/tasks.store';

@Component({
  selector: 'app-tasks-list',
  imports: [],
  template: `
    <section>
      <h2>Mis Tareas</h2>

      @if (store.filtered().length===0) {
      <p>No hay tareas aún, Agrega una desde el store.</p>
      } @else {
      <ul>
        @for (task of store.filtered(); track task.id) {
        <li>
          <label>
            <input type="checkbox" [checked]="task.done" (change)="store.toggle(task.id)" />
            <span [class.done]="task.done">{{ task.title }}</span>
          </label>
        </li>
        }
      </ul>
      }
    </section>
  `,
  styles: [
    `
      .done {
        text-decoration: line-through;
        opacity: 0.7;
      }
    `,
  ],
})
export class TasksListComponent {
  readonly store = inject(TASKS_STORE);
}
