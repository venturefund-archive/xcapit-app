import { FirebaseApp } from 'firebase/app';
import { FirebaseRemoteConfig } from './firebase-remote-config';

describe('FirebaseRemoteConfig', () => {
  let model: FirebaseRemoteConfig;
  let firebaseAppSpy: jasmine.SpyObj<FirebaseApp>;
  let firebaseRemoteConfigSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    const value = { asBoolean: () => false };
    firebaseRemoteConfigSpy = jasmine.createSpyObj('FirebaseRemoteConfig', {
      getRemoteConfig: { settings: {}},
      fetchAndActivate: Promise.resolve(true),
      getValue: value,
    });
    firebaseAppSpy = jasmine.createSpyObj('FirebaseApp', {}, {name: 'test'});
    model = new FirebaseRemoteConfig(firebaseAppSpy);
    model.firebaseRemoteConfig = firebaseRemoteConfigSpy;
  });

  it('should create', () => {
    expect(model).toBeTruthy();
  });

  it('should initialize firebase and fetch remote configuration on initialize', async () => {
    await model.initialize();
    expect(firebaseRemoteConfigSpy.getRemoteConfig).toHaveBeenCalledTimes(1);
    expect(firebaseRemoteConfigSpy.fetchAndActivate).toHaveBeenCalledTimes(1);
  });

  it('should get param for feature flag on getFeatureFlag', () => {
    const param = model.getFeatureFlag('test');
    expect(param).toBeFalse();
  });

  it('should call fetchAndActivate on fetchAndActivate', async () => {
    await model.fetchAndActivate();
    expect(firebaseRemoteConfigSpy.fetchAndActivate).toHaveBeenCalledTimes(1);
  });
});
