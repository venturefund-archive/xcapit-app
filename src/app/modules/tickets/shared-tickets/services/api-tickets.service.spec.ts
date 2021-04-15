import { TestBed } from '@angular/core/testing';

import { ApiTicketsService } from './api-tickets.service';

describe('ApiTicketsService', () => {
  let service: ApiTicketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTicketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
