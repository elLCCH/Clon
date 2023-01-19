/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PrerrequisitosService } from './prerrequisitos.service';

describe('Service: Prerrequisitos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrerrequisitosService]
    });
  });

  it('should ...', inject([PrerrequisitosService], (service: PrerrequisitosService) => {
    expect(service).toBeTruthy();
  }));
});
