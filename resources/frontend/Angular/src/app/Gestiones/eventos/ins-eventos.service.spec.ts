import { TestBed } from '@angular/core/testing';

import { InsEventosService } from './ins-eventos.service';

describe('InsEventosService', () => {
  let service: InsEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
