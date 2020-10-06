import { TestBed } from '@angular/core/testing';

import { PaymentsServiceService } from './payments-service.service';

describe('PaymentsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentsServiceService = TestBed.get(PaymentsServiceService);
    expect(service).toBeTruthy();
  });
});
