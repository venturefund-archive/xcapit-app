import { TestBed } from '@angular/core/testing';

import { ObjetiveDataService } from './objetive-data.service';

describe('ObjetiveDataService', () => {
  let service: ObjetiveDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjetiveDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store investment data', () => {
    service.income = 500;
    service.expenses = 200;

    expect(service.income).toEqual(500);
    expect(service.expenses).toEqual(200);
  });
});
