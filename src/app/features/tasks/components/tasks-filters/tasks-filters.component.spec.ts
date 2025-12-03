import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksFiltersComponent } from './tasks-filters.component';

describe('TasksFiltersComponent', () => {
  let component: TasksFiltersComponent;
  let fixture: ComponentFixture<TasksFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
