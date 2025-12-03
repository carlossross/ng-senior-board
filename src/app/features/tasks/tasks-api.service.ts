import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root', // global porque es infraestructura, no state
})
export class TasksApiService {
  getTasks(): Observable<Task[]> {
    // Simula un delay de red
    return of([
      { id: 'a1', title: 'Tarea API 1', done: false },
      { id: 'a2', title: 'Tarea API 2', done: true },
      { id: 'a3', title: 'Tarea API 3', done: false },
    ]).pipe(
      delay(800) // 800ms de red ficticia
    );
  }

  getTasksError(): Observable<never> {
    return throwError(() => new Error('Error de API')).pipe(delay(500));
  }
}
