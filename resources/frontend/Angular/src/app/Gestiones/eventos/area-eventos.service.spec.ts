import { TestBed } from '@angular/core/testing';

import { AreaEventosService } from './area-eventos.service';

describe('AreaEventosService', () => {
  let service: AreaEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
