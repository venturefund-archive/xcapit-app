import { TestBed } from '@angular/core/testing';
import { CapacitorNotificationsService } from './capacitor-notifications.service';
import { ApiDevicesService } from '../api-devices/api-devices.service';

describe('CapacitorNotificationsService', () => {
  let service: CapacitorNotificationsService;
  let pushNotificationsSpy: any;
  let apiDevicesServiceMock: any;

  beforeEach(() => {
    apiDevicesServiceMock = {};
    pushNotificationsSpy = jasmine.createSpyObj('PushNotifications', ['requestPermission', 'register', 'addListener']);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiDevicesService, useValue: apiDevicesServiceMock }],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CapacitorNotificationsService);
    service.pushNotifications = pushNotificationsSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call register on init when permission granted', async () => {
    pushNotificationsSpy.requestPermission.and.returnValue(Promise.resolve({ granted: true }));
    await service.init();
    expect(pushNotificationsSpy.register).toHaveBeenCalledTimes(1);
    expect(pushNotificationsSpy.addListener).toHaveBeenCalledTimes(2);
  });

  it('should not call register on init when permission is not granted', async () => {
    pushNotificationsSpy.requestPermission.and.returnValue(Promise.resolve({ granted: false }));
    await service.init();
    expect(pushNotificationsSpy.register).not.toHaveBeenCalled();
    expect(pushNotificationsSpy.addListener).toHaveBeenCalledTimes(2);
  });
});
