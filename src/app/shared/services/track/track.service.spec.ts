import { TestBed } from '@angular/core/testing';

import { TrackService } from './track.service';

describe('TrackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrackService = TestBed.inject(TrackService);
    expect(service).toBeTruthy();
  });
});
