import { TestBed } from '@angular/core/testing';

import { FrontServiceService } from './front-service.service';

describe('FrontServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrontServiceService = TestBed.get(FrontServiceService);
    expect(service).toBeTruthy();
  });
});
