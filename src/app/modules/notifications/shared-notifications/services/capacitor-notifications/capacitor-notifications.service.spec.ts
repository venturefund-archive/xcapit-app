import { TestBed } from '@angular/core/testing';
import { CapacitorNotificationsService } from './capacitor-notifications.service';
import { ApiDevicesService } from '../api-devices/api-devices.service';
import { PlatformService } from '../../../../../shared/services/platform/platform.service';

describe('CapacitorNotificationsService', () => {
  let service: CapacitorNotificationsService;
  let pushNotificationsSpy: any;
  let apiDevicesServiceMock: any;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;

  beforeEach(() => {
    apiDevicesServiceMock = {};
    pushNotificationsSpy = jasmine.createSpyObj('PushNotifications', ['requestPermissions', 'register', 'addListener']);
    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: false,
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiDevicesService, useValue: apiDevicesServiceMock },
        { provide: PlatformService, useValue: platformServiceSpy },
      ],
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
    pushNotificationsSpy.requestPermissions.and.returnValue(Promise.resolve({ receive: 'granted' }));
    await service.init();
    expect(pushNotificationsSpy.register).toHaveBeenCalledTimes(1);
  });

  it('should not call register on init when permission is not granted', async () => {
    pushNotificationsSpy.requestPermissions.and.returnValue(Promise.resolve({ receive: 'not granted' }));
    await service.init();
    expect(pushNotificationsSpy.register).not.toHaveBeenCalled();
  });

  it('should add listeners when platform is not native', () => {
    expect(pushNotificationsSpy.addListener).toHaveBeenCalledTimes(0);
  });
});
