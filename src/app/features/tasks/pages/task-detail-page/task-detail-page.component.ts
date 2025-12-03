import { Component, computed, effect, inject, signal } from '@angular/core';
import { TASKS_STORE, TasksStore } from '../../store/tasks.store';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-task-detail-page',
  imports: [],
  template: `
    <section class="task-detail">
      <header class="task-detail__header">
        <h1>Detalle de tarea</h1>
        <button type="button" (click)="goBack()">← Volver a la lista</button>
      </header>

      @if (task(); as t) {
      <article class="task-detail__card">
        <label>
          <span>Título</span>
          <input type="text" [value]="title()" (input)="title.set($event.target.value)" />
        </label>

        <label>
          <input type="checkbox" [checked]="done()" (change)="done.set($event.target.checked)" />
          Completada
        </label>

        <p class="task-detail__status">
          Estado en store:
          <strong>{{ t.done ? 'Completada' : 'Pendiente' }}</strong>
        </p>

        @if(isDirty()){
        <p class="task-detail__dirty">Tienes cambios sin guardar.</p>
        }

        <button type="button" (click)="save()" [disabled]="!isDirty()">Guardar cambios</button>

        <button type="button" (click)="remove(t.id)">Eliminar tarea</button>
      </article>
      } @else {
      <p>No se encontró la tarea. Quizá fue eliminada.</p>
      }
    </section>
  `,
  styles: [
    `
      .task-detail {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .task-detail__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .task-detail__card {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 400px;
      }

      .task-detail__status {
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .task-detail__dirty {
        color: #d97706; /* amber-ish */
        font-size: 0.9rem;
      }

      label {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      label span {
        min-width: 50px;
      }

      input[type='text'] {
        flex: 1;
      }
    `,
  ],
})
export class TaskDetailPageComponent {
  private readonly store: TasksStore = inject(TASKS_STORE);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // id como signal, derivado del router
  readonly id = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))), {
    initialValue: null,
  });

  // tarea seleccionada como computed
  readonly task = computed(() => {
    const id = this.id();
    if (!id) return null;
    return this.store.tasks().find((task) => task.id === id) ?? null;
  });

  readonly title = signal('');
  readonly done = signal(false);

  readonly isDirty = computed(() => {
    const t = this.task();
    if (!t) return false;
    return t.title !== this.title() || t.done !== this.done();
  });

  constructor() {
    effect(() => {
      const t = this.task();
      if (t) {
        this.title.set(t.title);
        this.done.set(t.done);
      }
    });
  }

  save() {
    const id = this.id();
    if (!id) return;

    this.store.update(id, {
      title: this.title().trim(),
      done: this.done(),
    });
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }

  // toggle(id: string) {
  //   this.store.toggle(id);
  // }

  remove(id: string) {
    this.store.remove(id);
    this.goBack();
  }
}
