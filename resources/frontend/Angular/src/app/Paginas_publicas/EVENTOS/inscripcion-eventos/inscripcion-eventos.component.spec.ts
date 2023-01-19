import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionEventosComponent } from './inscripcion-eventos.component';

describe('InscripcionEventosComponent', () => {
  let component: InscripcionEventosComponent;
  let fixture: ComponentFixture<InscripcionEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripcionEventosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
