import { TestBed } from '@angular/core/testing';

import { InvoicesServiceService } from './invoices-service.service';

describe('InvoicesServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvoicesServiceService = TestBed.get(InvoicesServiceService);
    expect(service).toBeTruthy();
  });
});
