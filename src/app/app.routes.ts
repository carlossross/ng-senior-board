import { Routes } from '@angular/router';
import { provideTasksStore } from './features/tasks/store/tasks.store';
import { tasksNotEmptyGuard } from './features/tasks/tasks-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tasks',
  },
  {
    path: 'tasks',
    providers: [provideTasksStore()],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/tasks/pages/tasks-page/tasks-page.component').then(
            (m) => m.TasksPageComponent
          ),
      },
      {
        path: ':id',
        canMatch: [tasksNotEmptyGuard],
        loadComponent: () =>
          import('./features/tasks/pages/task-detail-page/task-detail-page.component').then(
            (m) => m.TaskDetailPageComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'tasks' },
];
