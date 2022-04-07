import { TestBed } from '@angular/core/testing';
import { PlatformService } from '../platform/platform.service';
import { FirebaseService } from './firebase.service';

describe('FirebaseService', () => {
  let service: FirebaseService;
  let firebaseSpy: any;
  let platformSpy: jasmine.SpyObj<PlatformService>;
  let firebaseAnalyticsSpy: any;
  beforeEach(() => {
    firebaseSpy = jasmine.createSpyObj(
      'FirebaseNamespace',
      { initializeApp: null, getApp: {}, getApps: [] },
    );
    firebaseAnalyticsSpy = jasmine.createSpyObj('FirebaseAnalytics', {
      initializeFirebase: Promise.resolve(),
    });

    platformSpy = jasmine.createSpyObj('platformService', ['isWeb']);
    TestBed.configureTestingModule({ providers: [{ provide: PlatformService, useValue: platformSpy }] });
    service = TestBed.inject(FirebaseService);
    service.firebaseAnalytics = firebaseAnalyticsSpy;
    service.importedFirebase = firebaseSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize firebase if there is not firebase app already', () => {
    service.init();
    expect(firebaseSpy.initializeApp).toHaveBeenCalledTimes(1);
  });

  it('should initialize analytics if the platform is web', () => {
    platformSpy.isWeb.and.returnValue(true);
    service.init();
    expect(service.firebaseAnalytics.initializeFirebase).toHaveBeenCalledTimes(1);
  });

  it('should not initialize analytics if the platform is not web', () => {
    platformSpy.isWeb.and.returnValue(false);
    service.init();
    expect(service.firebaseAnalytics.initializeFirebase).toHaveBeenCalledTimes(0);
  });

  it('should get initialized app on getApp', () => {
    service.getApp();
    expect(firebaseSpy.getApp).toHaveBeenCalledTimes(1);
  });
});
