import { TestBed } from '@angular/core/testing';

import { GuardInscripcionesGuard } from './guard-inscripciones.guard';

describe('GuardInscripcionesGuard', () => {
  let guard: GuardInscripcionesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardInscripcionesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
