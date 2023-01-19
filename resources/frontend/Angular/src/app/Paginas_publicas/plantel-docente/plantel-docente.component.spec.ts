import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantelDocenteComponent } from './plantel-docente.component';

describe('PlantelDocenteComponent', () => {
  let component: PlantelDocenteComponent;
  let fixture: ComponentFixture<PlantelDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantelDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantelDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
