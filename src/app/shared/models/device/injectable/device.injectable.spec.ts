import { TestBed } from '@angular/core/testing';
import { DefaultDevice } from '../default/default-device';

import { DeviceInjectable } from './device.injectable';

describe('DeviceInjectableService', () => {
  let deviceInjectable: DeviceInjectable;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    deviceInjectable = TestBed.inject(DeviceInjectable);
  });

  it('should be created', () => {
    expect(deviceInjectable).toBeTruthy();
  });

  it('create', () => {
    expect(deviceInjectable.create()).toBeInstanceOf(DefaultDevice);
  });
});
