import { TestBed } from '@angular/core/testing';

import { OffersServiceService } from './offers-service.service';

describe('OffersServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OffersServiceService = TestBed.get(OffersServiceService);
    expect(service).toBeTruthy();
  });
});
