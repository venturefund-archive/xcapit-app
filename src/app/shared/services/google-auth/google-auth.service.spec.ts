import { TestBed } from '@angular/core/testing';
import { GoogleAuthService } from './google-auth.service';

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;
  let googleAuthSpy: any;

  const userTest = {
    authentication: {
      accessToken: 'testToken',
    },
  };

  beforeEach(() => {
    googleAuthSpy = jasmine.createSpyObj('googleAuth', { initialize: null, signIn: Promise.resolve(userTest) });
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAuthService);
    service.googleAuth = googleAuthSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize firebase if there is not firebase app already', () => {
    service.init();
    expect(googleAuthSpy.initialize).toHaveBeenCalledTimes(1);
  });

  it('should initialize firebase if there is not firebase app already', async () => {
    await service.accessToken();
    expect(googleAuthSpy.signIn).toHaveBeenCalledTimes(1);
  });
});
