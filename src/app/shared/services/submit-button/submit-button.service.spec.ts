import { TestBed } from '@angular/core/testing';

import { SubmitButtonService } from './submit-button.service';

describe('SubmitButtonService', () => {
  let service: SubmitButtonService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(SubmitButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be isDisabled return false when call enabled', () => {
    service.enabled();
    service.isDisabled.subscribe((data) => expect(data).toBeFalsy());
  });

  it('should be isDisabled return true when call disaabled', () => {
    service.disabled();
    service.isDisabled.subscribe((data) => expect(data).toBeTruthy());
  });
});
