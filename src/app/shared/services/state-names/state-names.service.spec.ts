import { TestBed } from '@angular/core/testing';

import { StateNamesService } from './state-names.service';

describe('StateNamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateNamesService = TestBed.get(StateNamesService);
    expect(service).toBeTruthy();
  });
});
