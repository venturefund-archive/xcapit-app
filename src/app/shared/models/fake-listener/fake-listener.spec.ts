import { FakeListener } from './fake-listener';

describe('FakeListener', () => {
  let fakeListener: FakeListener;
  let callbackSpy: jasmine.Spy;
  const anEventName = 'anEventName';
  const anEventParams = { aKey: 'aValue' };

  beforeEach(() => {
    fakeListener = new FakeListener();
    callbackSpy = jasmine.createSpy('SomeFunction', () => {});
  });

  it('new  ', () => {
    expect(fakeListener).toBeTruthy();
  });

  it('execute an event', async () => {
    fakeListener.addListener(anEventName, callbackSpy);

    await fakeListener.executeEvent(anEventName);

    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });

  it('execute an event with params', async () => {
    fakeListener.addListener(anEventName, callbackSpy);

    await fakeListener.executeEvent(anEventName, anEventParams);

    expect(callbackSpy).toHaveBeenCalledOnceWith(anEventParams);
  });

  it('removeAllListeners', async () => {
    fakeListener.addListener(anEventName, callbackSpy);

    fakeListener.removeAllListeners();

    await expectAsync(fakeListener.executeEvent(anEventName, anEventParams)).toBeRejected();
  });

  it('eventsCount', async () => {
    fakeListener.addListener(anEventName, callbackSpy);
    expect(fakeListener.eventsCount()).toEqual(1);
  });
});
