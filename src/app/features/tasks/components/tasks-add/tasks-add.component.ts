import { Component, inject, signal } from '@angular/core';
import { TASKS_STORE } from '../../store/tasks.store';

@Component({
  selector: 'app-tasks-add',
  imports: [],
  template: `
    <form (submit)="onSubmit($event)" class="tasks-add">
      <input
        type="text"
        class="tasks-add__input"
        placeholder="Nueva tarea..."
        [value]="title()"
        (input)="title.set($event.target.value)"
      />
      <button type="submit" class="tasks-add__btn">Agregar</button>
    </form>
  `,
  styles: [
    `
      .tasks-add {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .tasks-add__input {
        flex: 1;
        padding: 0.5rem 0.75rem;
      }

      .tasks-add__btn {
        padding: 0.5rem 0.75rem;
        cursor: pointer;
      }
    `,
  ],
})
export class TasksAddComponent {
  private readonly store = inject(TASKS_STORE);

  // Signal local para manejar el input
  readonly title = signal('');

  onSubmit(event: Event) {
    event.preventDefault();
    const value = this.title().trim();
    if (!value) return;

    this.store.add(value);
    this.title.set('');
  }
}
