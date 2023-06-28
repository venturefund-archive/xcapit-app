import { FakePushNotifications } from './fake-push-notifications';


describe('FakePushNotifications', () => {
  let fakePushNotifications: FakePushNotifications;

  beforeEach(() => {
    fakePushNotifications = new FakePushNotifications();
  });
  it('new  ', () => {
    expect(fakePushNotifications).toBeTruthy();
  });

  it('fake execute registered events', async () => {
    const callbackSpy = jasmine.createSpy('SomeFunction', () => {});
    fakePushNotifications.addListener('register', callbackSpy);

    await fakePushNotifications.executeRegisteredEvents();

    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });

  it('fake execute multiple registered events', async () => {
    const callbackSpy = jasmine.createSpy('SomeFunction', () => {});
    fakePushNotifications.addListener('register', callbackSpy);
    fakePushNotifications.addListener('registrationError', callbackSpy);

    await fakePushNotifications.executeRegisteredEvents();

    expect(callbackSpy).toHaveBeenCalledTimes(2);
  });
});
