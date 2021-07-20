import { TestBed } from '@angular/core/testing';

import { BwcService } from './bwc.service';

describe('BwcService', () => {
  let service: BwcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BwcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
