import { LocalNotificationsPlugin } from '@capacitor/local-notifications';
import { FakeLocalNotificationPlugin } from '../fake/plugin/fake-local-notification-plugin';
import { LocalNotification } from '../local-notification.interface';
import { DefaultLocalNotification } from './default-local-notification';

fdescribe('LocalNotification', () => {
  let localNotification: LocalNotification;
  let localNotificationPluginSpy: jasmine.SpyObj<LocalNotificationsPlugin>;
  beforeEach(() => {
    localNotification = new DefaultLocalNotification(2, 'testTitle', 'testBody', new FakeLocalNotificationPlugin());
  });

  it('new', () => {
    expect(localNotification).toBeTruthy();
  });

  it('send with permissions', async () => {
    await expectAsync(localNotification.send()).toBeResolved();
  });

  it('send without permissions', async () => {
    localNotificationPluginSpy = jasmine.createSpyObj('LocalNotificationsPlugin', {
      schedule: Promise.resolve(),
      checkPermissions: Promise.resolve({ display: 'denied' }),
    });
    localNotification = new DefaultLocalNotification(2, 'testTitle', 'testBody', localNotificationPluginSpy);
    await localNotification.send();
    expect(localNotificationPluginSpy.schedule).toHaveBeenCalledTimes(0);
  });

  it('onClick', () => {
    localNotificationPluginSpy = jasmine.createSpyObj('LocalNotificationsPlugin', {
      schedule: Promise.resolve(),
      checkPermissions: Promise.resolve({ display: 'denied' }),
      addListener: Promise.resolve(),
    });
    localNotification = new DefaultLocalNotification(2, 'testTitle', 'testBody', localNotificationPluginSpy);
    localNotification.onClick(()=>{});
    expect(localNotificationPluginSpy.addListener).toHaveBeenCalledTimes(1);
  });
});
