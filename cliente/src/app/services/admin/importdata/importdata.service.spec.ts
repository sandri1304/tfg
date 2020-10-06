import { TestBed } from '@angular/core/testing';

import { ImportdataService } from './importdata.service';

describe('ImportdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImportdataService = TestBed.get(ImportdataService);
    expect(service).toBeTruthy();
  });
});
