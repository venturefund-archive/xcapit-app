import { TestBed } from '@angular/core/testing';
import { NativeFirebaseLogsService } from './native-firebase-logs.service';

describe('NativeFirebaseLogsService', () => {
  let firebaseAnalyticsSpy: any;
  let service: NativeFirebaseLogsService;
  beforeEach(() => {
    firebaseAnalyticsSpy = jasmine.createSpyObj('NativeFirebaseLogsService', {
      init: Promise.resolve(),
      setCollectionEnabled: Promise.resolve(),
      logEvent: Promise.resolve(),
    });
    TestBed.configureTestingModule({});
    service = TestBed.inject(NativeFirebaseLogsService);
    service.firebaseAnalytics = firebaseAnalyticsSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not log event when track view is called', () => {
    service.trackView({});
    expect(firebaseAnalyticsSpy.logEvent).not.toHaveBeenCalled();
  });

  it('should log event when track event is called', () => {
    service.trackEvent({
      eventCategory: 'testCategory',
      eventLabel: 'testLabel',
      eventAction: 'testAction',
      eventValue: 'testValue',
    });
    expect(firebaseAnalyticsSpy.logEvent).toHaveBeenCalledOnceWith({
      name: 'button_click',
      params: {
        name: 'testLabel',
        action: 'testAction',
        value: 'testValue',
        category: 'testCategory',
      },
    });
  });

  it('should send track event login on track login', () => {
    const loginEventData = {
      name: 'login',
      params: {
        method: 'Xcapit',
      },
    };
    service.trackLogin();
    expect(firebaseAnalyticsSpy.logEvent).toHaveBeenCalledOnceWith(loginEventData);
  });

  it('should send track event sign up on track sign up', () => {
    const signUpEventData = {
      name: 'sign_up',
      params: {
        method: 'Xcapit',
      },
    };
    service.trackSignUp();
    expect(firebaseAnalyticsSpy.logEvent).toHaveBeenCalledOnceWith(signUpEventData);
  });
});
