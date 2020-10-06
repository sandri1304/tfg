import { TestBed } from '@angular/core/testing';

import { OrdersServiceService } from './orders-service.service';

describe('OrdersServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrdersServiceService = TestBed.get(OrdersServiceService);
    expect(service).toBeTruthy();
  });
});
