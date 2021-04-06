import { TestBed } from '@angular/core/testing';
import { RefreshTimeoutService } from './refresh-timeout.service';

describe('RefreshTimeoutService', () => {
  let service: RefreshTimeoutService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
    service = TestBed.inject(RefreshTimeoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
