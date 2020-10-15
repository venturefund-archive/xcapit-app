import { TestBed } from '@angular/core/testing';

import { DynamicComponentService } from './dynamic-component.service';

describe('DynamicComponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicComponentService = TestBed.inject(DynamicComponentService);
    expect(service).toBeTruthy();
  });
});
