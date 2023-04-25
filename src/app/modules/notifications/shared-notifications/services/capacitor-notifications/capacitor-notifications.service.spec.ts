import { TestBed } from '@angular/core/testing';
import { CapacitorNotificationsService } from './capacitor-notifications.service';

describe('CapacitorNotificationsService', () => {
  let service: CapacitorNotificationsService;
  let pushNotificationsSpy: any;
  let firebaseCloudMessagingSpy: any;
  beforeEach(() => {
    pushNotificationsSpy = jasmine.createSpyObj('PushNotifications', {
      addListener: null,
    });
    firebaseCloudMessagingSpy = jasmine.createSpyObj('FirebaseCloudMessaging', {
      unsubscribeFrom: null,
      subscribeTo: null,
    });
    TestBed.configureTestingModule({});
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
});
