import { TestBed } from '@angular/core/testing';
import { FirebaseNamespace } from '@firebase/app-types';
import { PlatformService } from '../platform/platform.service';
import { FirebaseService } from './firebase.service';

describe('FirebaseService', () => {
  let service: FirebaseService;
  let firebaseSpy: any;
  let platformSpy: jasmine.SpyObj<PlatformService>;
  let firebaseAnalyticsSpy: any;
  beforeEach(() => {
    firebaseSpy = jasmine.createSpyObj('FirebaseNamespace', ['initializeApp', 'app'], { apps: [] });
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

  it('should only get app and not initialize firebase if there is firebase app', () => {
    firebaseSpy = jasmine.createSpyObj('FirebaseNamespace', ['initializeApp', 'app'], { apps: ['app1', 'app2'] });
    service.importedFirebase = firebaseSpy;
    service.init();
    expect(service.importedFirebase.initializeApp).toHaveBeenCalledTimes(0);
  });

  it('should initialize analytics if the platform is web and there is no firebase app', () => {
    platformSpy.isWeb.and.returnValue(true);
    service.init();
    expect(service.firebaseAnalytics.initializeFirebase).toHaveBeenCalledTimes(1);
  });

  it('should not initialize analytics if the platform is not web', () => {
    platformSpy.isWeb.and.returnValue(false);
    service.init();
    expect(service.firebaseAnalytics.initializeFirebase).toHaveBeenCalledTimes(0);
  });
});
