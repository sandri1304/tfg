import { TestBed } from '@angular/core/testing';

import { FaqServiceService } from './faq-service.service';

describe('FaqServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaqServiceService = TestBed.get(FaqServiceService);
    expect(service).toBeTruthy();
  });
});
