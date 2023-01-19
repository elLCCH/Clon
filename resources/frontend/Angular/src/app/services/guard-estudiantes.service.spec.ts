import { TestBed } from '@angular/core/testing';

import { GuardEstudiantesService } from './guard-estudiantes.service';

describe('GuardEstudiantesService', () => {
  let service: GuardEstudiantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuardEstudiantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
