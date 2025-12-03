import { Component, inject } from '@angular/core';
import { TASKS_STORE } from '../../store/tasks.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks-list',
  imports: [RouterLink],
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
            <a [routerLink]="['/tasks', task.id]" [class.done]="task.done">
              {{ task.title }}
            </a>
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
