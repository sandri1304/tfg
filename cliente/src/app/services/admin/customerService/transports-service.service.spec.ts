import { TestBed } from '@angular/core/testing';

import { TransportsServiceService } from './transports-service.service';

describe('TransportsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransportsServiceService = TestBed.get(TransportsServiceService);
    expect(service).toBeTruthy();
  });
});
