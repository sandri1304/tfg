import { TestBed } from '@angular/core/testing';

import { BrandsServiceService } from './brands-service.service';

describe('BrandsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrandsServiceService = TestBed.get(BrandsServiceService);
    expect(service).toBeTruthy();
  });
});
