import { TestBed } from '@angular/core/testing';

import { GuardInscripcionesNuevosGuard } from './guard-inscripciones-nuevos.guard';

describe('GuardInscripcionesNuevosGuard', () => {
  let guard: GuardInscripcionesNuevosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardInscripcionesNuevosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
