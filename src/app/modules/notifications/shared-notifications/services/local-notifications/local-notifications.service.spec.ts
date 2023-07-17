import { TestBed } from '@angular/core/testing';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';
import { LocalNotificationsService } from './local-notifications.service';

describe('LocalNotificationsService', () => {
  let localNotificationsSpy: jasmine.SpyObj<any>;
  let service: LocalNotificationsService;
  let platformServiceSpy: jasmine.SpyObj<DefaultPlatformService>;
  beforeEach(() => {
    localNotificationsSpy = jasmine.createSpyObj('LocalNotifications', {
      requestPermissions: Promise.resolve({ display: 'granted' }),
      addListener: (callback) => {
        callback();
      },
      registerActionTypes: Promise.resolve(),
      schedule: Promise.resolve(),
    });
    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: false,
    });
    TestBed.configureTestingModule({
      providers: [{ provide: DefaultPlatformService, useValue: platformServiceSpy }],
    });
    service = TestBed.inject(LocalNotificationsService);
    service.localNotifications = localNotificationsSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request permissions on init', async () => {
    await service.init();

    expect(localNotificationsSpy.requestPermissions).toHaveBeenCalledTimes(1);
  });

  it('should send notification if permission is granted', async () => {
    await service.init();

    await service.send(jasmine.createSpyObj('Notification', {}, { notification: 'test' }));

    expect(localNotificationsSpy.schedule).toHaveBeenCalledTimes(1);
  });

  it('should not send notification if permission is not granted', async () => {
    localNotificationsSpy.requestPermissions.and.resolveTo({ display: 'not granted' });
    await service.init();

    await service.send(jasmine.createSpyObj('Notification', {}, { notification: 'test' }));

    expect(localNotificationsSpy.schedule).toHaveBeenCalledTimes(0);
  });

  it('should call addListener', async () => {
    const callbackSpy = jasmine.createSpy();
    await service.init();

    service.addListener(callbackSpy);

    expect(localNotificationsSpy.addListener).toHaveBeenCalledTimes(1);
  });

  it('should call setActionTypes when platform is native', async () => {
    await service.init();
    platformServiceSpy.isNative.and.returnValue(true);

    service.registerActionTypes('1', []);

    expect(localNotificationsSpy.registerActionTypes).toHaveBeenCalledTimes(1);
  });

  it('should not call setActionTypes when platform is not native', async () => {
    await service.init();
    platformServiceSpy.isNative.and.returnValue(false);

    service.registerActionTypes('1', []);

    expect(localNotificationsSpy.registerActionTypes).toHaveBeenCalledTimes(0);
  });
});
