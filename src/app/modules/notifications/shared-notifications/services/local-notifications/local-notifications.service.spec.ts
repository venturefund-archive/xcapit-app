import { TestBed } from '@angular/core/testing';
import { LocalNotificationSchema } from '@capacitor/local-notifications';
import { LocalNotificationsService } from './local-notifications.service';

fdescribe('LocalNotificationsService', () => {
  let localNotificationsSpy: jasmine.SpyObj<any>;
  let service: LocalNotificationsService;
  beforeEach(() => {
    localNotificationsSpy = jasmine.createSpyObj('LocalNotifications', {
      requestPermissions: Promise.resolve({ display: 'granted' }),
      addListener: null,
      schedule: Promise.resolve(),
    });
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalNotificationsService);
    service.localNotifications = localNotificationsSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request permissions on init', () => {
    service.init();
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
});
