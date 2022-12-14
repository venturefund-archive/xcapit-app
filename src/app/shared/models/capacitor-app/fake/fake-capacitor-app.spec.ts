import { FakeCapacitorApp } from './fake-capacitor-app';

describe('FakeCapacitorApp', () => {
  let fakeCapacitorApp: FakeCapacitorApp;

  beforeEach(() => {
    fakeCapacitorApp = new FakeCapacitorApp(Promise.resolve({}));
  });

  it('new', () => {
    expect(fakeCapacitorApp).toBeTruthy();
  });

  it('info', async () => {
    expect(await fakeCapacitorApp.info()).toEqual({});
  });

  it('on state change', () => {
    expect(fakeCapacitorApp.onStateChange(() => {})).toBeUndefined();
  });
});
