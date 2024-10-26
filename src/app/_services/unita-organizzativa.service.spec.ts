import { TestBed } from '@angular/core/testing';

import { UnitaOrganizzativaService } from './unita-organizzativa.service';

describe('UnitaOrganizzativaService', () => {
  let service: UnitaOrganizzativaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitaOrganizzativaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
