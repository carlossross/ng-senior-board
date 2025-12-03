import { Routes } from '@angular/router';
import { provideTasksStore } from './features/tasks/store/tasks.store';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tasks',
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/pages/tasks-page/tasks-page.component').then(
        (m) => m.TasksPageComponent
      ),
    providers: [provideTasksStore()],
  },
  { path: '**', redirectTo: 'tasks' },
];
