import { FirebaseService } from '../../../services/firebase/firebase.service';
import { firebaseInitializer } from './firebase-initializer';
import { RemoteConfigService } from '../../../services/remote-config/remote-config.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('firebaseInitializer', () => {
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let firebaseSpy: jasmine.SpyObj<FirebaseService>;

  beforeEach(() => {
    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', { initialize: Promise.resolve() });
    firebaseSpy = jasmine.createSpyObj('FirebaseService', { init: Promise.resolve(), getApp: null });
  });

  it('should initialize services', fakeAsync(() => {
    firebaseInitializer(remoteConfigSpy, firebaseSpy)();
    tick();
    expect(remoteConfigSpy.initialize).toHaveBeenCalledTimes(1);
    expect(firebaseSpy.init).toHaveBeenCalledTimes(1);
    expect(firebaseSpy.getApp).toHaveBeenCalledTimes(1);
  }));

  it('should continue when firebase request fails', fakeAsync(async () => {
    firebaseSpy.init.and.returnValue(Promise.reject());
    firebaseInitializer(remoteConfigSpy, firebaseSpy)();
    tick();
    expect(firebaseSpy.init).toHaveBeenCalledTimes(1);
    expectAsync(firebaseInitializer(remoteConfigSpy, firebaseSpy)()).toBeResolved();
  }));

});
