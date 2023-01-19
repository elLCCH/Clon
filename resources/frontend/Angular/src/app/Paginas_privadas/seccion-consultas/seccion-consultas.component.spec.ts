import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionConsultasComponent } from './seccion-consultas.component';

describe('SeccionConsultasComponent', () => {
  let component: SeccionConsultasComponent;
  let fixture: ComponentFixture<SeccionConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionConsultasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
