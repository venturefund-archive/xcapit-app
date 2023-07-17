import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiDevicesService } from '../api-devices/api-devices.service';
import { CapacitorNotificationsService } from './capacitor-notifications.service';
import { DefaultPlatformService } from '../../../../../shared/services/platform/default/default-platform.service';
import { FakePushNotifications } from '../../models/fake-push-notifications/fake-push-notifications';

describe('CapacitorNotificationsService', () => {
  let service: CapacitorNotificationsService;

  let pushNotificationsSpy: any;
  let firebaseCloudMessagingSpy: any;
  let apiDevicesServiceSpy: jasmine.SpyObj<ApiDevicesService>;
  let platformServiceSpy: jasmine.SpyObj<DefaultPlatformService>;

  beforeEach(() => {
    pushNotificationsSpy = jasmine.createSpyObj('PushNotifications', {
      addListener: null,
    });

    firebaseCloudMessagingSpy = jasmine.createSpyObj('FirebaseCloudMessaging', {
      unsubscribeFrom: null,
      subscribeTo: null,
    });

    apiDevicesServiceSpy = jasmine.createSpyObj('ApiDevicesService', {
      register: of(),
      togglePushNotifications: of(),
    });

    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: true,
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiDevicesService, useValue: apiDevicesServiceSpy },
        { provide: DefaultPlatformService, useValue: platformServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CapacitorNotificationsService);
    service.pushNotifications = pushNotificationsSpy;
    service.firebaseCloudMessaging = firebaseCloudMessagingSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call push notifications listener on pushNotificationActionPerformed', () => {
    const callbackSpy = jasmine.createSpy();
    service.pushNotificationActionPerformed(callbackSpy);
    expect(pushNotificationsSpy.addListener).toHaveBeenCalledTimes(1);
  });

  it('should call push notifications listener on pushNotificationReceived', () => {
    const callbackSpy = jasmine.createSpy('SomeFunction', () => {});
    service.pushNotificationReceived(callbackSpy);
    expect(pushNotificationsSpy.addListener).toHaveBeenCalledTimes(1);
  });

  it('should call firebase cloud messaging unsubscribeFrom method on unsubscribeFrom', () => {
    service.unsubscribeFrom('aTopic');
    expect(firebaseCloudMessagingSpy.unsubscribeFrom).toHaveBeenCalledOnceWith({ topic: 'aTopic' });
  });

  it('should call firebase cloud messaging subscribeTo method on unsubscribeFrom', () => {
    service.subscribeTo('aTopic');
    expect(firebaseCloudMessagingSpy.subscribeTo).toHaveBeenCalledOnceWith({ topic: 'aTopic' });
  });

  it('should call registration listener on init', () => {
    service.init();
    expect(pushNotificationsSpy.addListener).toHaveBeenCalledTimes(2);
  });

  it('should register device on registration event if native', async () => {
    console.error = jasmine.createSpy('error');
    service.pushNotifications = new FakePushNotifications();
    service.init();

    await service.pushNotifications.executeRegisteredEvents();

    expect(apiDevicesServiceSpy.register).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should not register device on registration event if not native', async () => {
    console.error = jasmine.createSpy('error');
    platformServiceSpy.isNative.and.returnValue(false);
    service.pushNotifications = new FakePushNotifications();
    service.init();

    await service.pushNotifications.executeRegisteredEvents();

    expect(apiDevicesServiceSpy.register).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should register device on init', async () => {
    service.pushNotifications = new FakePushNotifications();
    service.init();

    await service.register();

    expect(apiDevicesServiceSpy.register).toHaveBeenCalled();
  });

  it('should register device once', async () => {
    service.pushNotifications = new FakePushNotifications();
    service.init();

    await service.register();
    await service.register();

    expect(apiDevicesServiceSpy.register).toHaveBeenCalledTimes(1);
  });

  it('should register again after clear registration', async () => {
    service.pushNotifications = new FakePushNotifications();
    service.init();

    await service.register();
    service.clearRegistration();
    await service.register();

    expect(apiDevicesServiceSpy.register).toHaveBeenCalledTimes(2);
  });

  it('should toggle push notifications with value given when called', () => {
    service.toggleUserNotifications(true);

    expect(apiDevicesServiceSpy.togglePushNotifications).toHaveBeenCalledWith(true);
  })
});
