import { TestBed } from '@angular/core/testing';

import { AdminDocenteGuard } from './admin-docente.guard';

describe('AdminDocenteGuard', () => {
  let guard: AdminDocenteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminDocenteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
