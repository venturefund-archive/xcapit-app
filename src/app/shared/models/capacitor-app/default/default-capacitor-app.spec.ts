import { AppInfo, AppPlugin } from '@capacitor/app';
import { DefaultCapacitorApp } from './default-capacitor-app';

describe('App', () => {
  let defaultCapacitorApp: DefaultCapacitorApp;
  let appPluginSpy: jasmine.SpyObj<AppPlugin>;
  let getInfoData: AppInfo = { name: 'testApp', id: 'com.xcapit.app', build: '300', version: '3.0.0' };

  beforeEach(() => {
    appPluginSpy = jasmine.createSpyObj('AppPlugin', {
      getInfo: Promise.resolve(getInfoData),
    });

    defaultCapacitorApp = new DefaultCapacitorApp(appPluginSpy);
  });

  it('new', () => {
    expect(defaultCapacitorApp).toBeTruthy();
  });

  it('info', async () => {
    expect(await defaultCapacitorApp.info()).toEqual(getInfoData);
  });
});