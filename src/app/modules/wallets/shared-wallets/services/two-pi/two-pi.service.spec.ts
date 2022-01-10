import { TestBed } from '@angular/core/testing';

import { TwoPiService } from './two-pi.service';

describe('TwoPiService', () => {
  let service: TwoPiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwoPiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
