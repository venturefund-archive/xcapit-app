import { DefaultLocalNotification } from '../default/default-local-notification';
import { LocalNotificationInjectable } from './local-notification.injectable';

describe('LocalNotificationInjectable', () => {
  it('create injectable', () => {
    expect(new LocalNotificationInjectable()).toBeTruthy();
  });

  it('createInitialized', () => {
    expect(new LocalNotificationInjectable().createInitialized('title', 'body')).toBeInstanceOf(
      DefaultLocalNotification
    );
  });
});
