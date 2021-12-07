import { TestBed } from '@angular/core/testing';

import { ApiWealthManagementsService } from './api-wealth-managements.service';

describe('ApiWealthManagementsService', () => {
  let service: ApiWealthManagementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiWealthManagementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
