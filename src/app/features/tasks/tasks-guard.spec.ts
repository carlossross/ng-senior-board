import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { tasksGuard } from './tasks-guard';

describe('tasksGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => tasksGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
