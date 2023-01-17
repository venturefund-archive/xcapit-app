import { AppInfo, AppPlugin } from '@capacitor/app';
import { DefaultCapacitorApp } from './default-capacitor-app';

describe('DefaultCapacitorApp', () => {
  let defaultCapacitorApp: DefaultCapacitorApp;
  let appPluginSpy: jasmine.SpyObj<AppPlugin>;
  const getInfoData: AppInfo = { name: 'testApp', id: 'com.xcapit.app', build: '300', version: '3.0.0' };

  beforeEach(() => {
    appPluginSpy = jasmine.createSpyObj('AppPlugin', {
      getInfo: Promise.resolve(getInfoData),
      addListener: null,
    });

    defaultCapacitorApp = new DefaultCapacitorApp(appPluginSpy);
  });

  it('new', () => {
    expect(defaultCapacitorApp).toBeTruthy();
  });

  it('info', async () => {
    expect(await defaultCapacitorApp.info()).toEqual(getInfoData);
  });

  it('on state change ', () => {
    defaultCapacitorApp.onStateChange(() => {});
    expect(appPluginSpy.addListener).toHaveBeenCalledTimes(1);
  });

  it('on pause ', () => {
    defaultCapacitorApp.onPause(() => {});
    expect(appPluginSpy.addListener).toHaveBeenCalledTimes(1);
  });

  it('on app url open ', () => {
    defaultCapacitorApp.onAppUrlOpen(() => {});
    expect(appPluginSpy.addListener).toHaveBeenCalledTimes(1);
  });
});
