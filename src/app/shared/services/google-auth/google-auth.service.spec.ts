import { TestBed } from '@angular/core/testing';
import { GoogleAuthService } from './google-auth.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;
  let googleAuthSpy: any;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const userTest = {
    authentication: {
      accessToken: 'testToken',
    },
  };

  beforeEach(() => {
    googleAuthSpy = jasmine.createSpyObj('googleAuth', {
      initialize: null,
      signIn: Promise.resolve(userTest),
      signOut: Promise.resolve(),
      refresh: Promise.resolve({ accessToken: userTest.authentication.accessToken }),
    });
    httpClientSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
    });
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
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

  it('should sign in and get access token', async () => {
    await service.accessToken();
    expect(googleAuthSpy.signIn).toHaveBeenCalledTimes(1);
    expect(await service.accessToken()).toEqual('testToken');
  });

  it('should get access token with refresh if sign in fails', async () => {
    googleAuthSpy.signIn.and.returnValue(Promise.reject());
    await service.accessToken();
    expect(googleAuthSpy.signIn).toHaveBeenCalledTimes(1);
    expect(await service.accessToken()).toEqual('testToken');
  });

  it('should create file', () => {
    service.createFile('token', 'encryptedWallet');
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });
});
