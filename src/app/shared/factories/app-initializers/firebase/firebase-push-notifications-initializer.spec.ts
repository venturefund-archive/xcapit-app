import { NotificationsService } from 'src/app/modules/notifications/shared-notifications/services/notifications/notifications.service';
import { NullNotificationsService } from 'src/app/modules/notifications/shared-notifications/services/null-notifications/null-notifications.service';
import { firebasePushNotificationsInitializer } from './firebase-push-notifications-initializer';

describe('FirebasePushNotificationsInitializer', () => {
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;

  beforeEach(() => {
    notificationsServiceSpy = jasmine.createSpyObj('CapacitorNotificationsService', {
      getInstance: new NullNotificationsService(),
    });
  });

  it('should initialize services', () => {
    firebasePushNotificationsInitializer(notificationsServiceSpy)();

    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(1);
  });

  it('should continue when firebase request fails', () => {
    notificationsServiceSpy.getInstance.and.throwError('error');
    firebasePushNotificationsInitializer(notificationsServiceSpy)();

    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(1);
  });
});
