import { TestBed } from '@angular/core/testing';

import { SubmitButtonService } from './submit-button.service';

describe('SubmitButtonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubmitButtonService = TestBed.get(SubmitButtonService);
    expect(service).toBeTruthy();
  });
});
