import { TestBed } from '@angular/core/testing';

import { CategoriesServiceService } from './categories-service.service';

describe('CategoriesServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoriesServiceService = TestBed.get(CategoriesServiceService);
    expect(service).toBeTruthy();
  });
});
