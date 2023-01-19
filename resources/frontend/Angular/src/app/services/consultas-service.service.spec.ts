import { TestBed } from '@angular/core/testing';

import { ConsultasServiceService } from './consultas-service.service';

describe('ConsultasServiceService', () => {
  let service: ConsultasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
