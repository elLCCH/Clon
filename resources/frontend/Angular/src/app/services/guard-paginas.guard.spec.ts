import { TestBed } from '@angular/core/testing';

import { GuardPaginasGuard } from './guard-paginas.guard';

describe('GuardPaginasGuard', () => {
  let guard: GuardPaginasGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardPaginasGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
