
import { FakeLocalNotification } from './fake-local-notification';


describe('FakeLocalNotification', () => {
  let fakeLocalNofitication: FakeLocalNotification;
  let callbackSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    fakeLocalNofitication = new FakeLocalNotification();
    callbackSpy = jasmine.createSpy('Callback');
  });

  it('new', () => {
    expect(fakeLocalNofitication).toBeTruthy();
  });

  it('send', async () => {
    expect(await fakeLocalNofitication.send()).toBeUndefined();
  });

  it('onClick', () => {
    expect(fakeLocalNofitication.onClick(() => {})).toBeUndefined();
  });

  it('triggerOnClick', () => {
    fakeLocalNofitication.onClick(callbackSpy);
    fakeLocalNofitication.triggerOnClick();
    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });
});
