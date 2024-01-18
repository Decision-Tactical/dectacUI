import { TestBed } from '@angular/core/testing';

import { UtilityFactoryService } from './utility-factory.service';

describe('UtilityFactoryService', () => {
  let service: UtilityFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
