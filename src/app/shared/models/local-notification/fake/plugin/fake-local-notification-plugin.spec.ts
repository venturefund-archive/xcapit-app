import { FakeLocalNotificationPlugin } from './fake-local-notification-plugin';

fdescribe('FakeLocalNotificationPlugin', () => {
  let localNotificationPlugin: FakeLocalNotificationPlugin;

  beforeEach(() => {
    localNotificationPlugin = new FakeLocalNotificationPlugin();
  });

  it('new', () => {
    expect(localNotificationPlugin).toBeTruthy();
  });

  it('schedule', async () => {
    expect(await localNotificationPlugin.schedule({ notifications: [{ id: 1, title: '', body: '' }] })).toEqual({
      notifications: [{ id: 1 }],
    });
  });

  it('checkPermissions', async () => {
    expect(await localNotificationPlugin.checkPermissions()).toEqual({ display: 'granted' });
  });

  it('addListener', () => {
    expect(localNotificationPlugin.addListener('',()=>{})).toBeUndefined();
  });
});
