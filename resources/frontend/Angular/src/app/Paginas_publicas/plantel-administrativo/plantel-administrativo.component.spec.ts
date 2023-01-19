import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantelAdministrativoComponent } from './plantel-administrativo.component';

describe('PlantelAdministrativoComponent', () => {
  let component: PlantelAdministrativoComponent;
  let fixture: ComponentFixture<PlantelAdministrativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantelAdministrativoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantelAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
