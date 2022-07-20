import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { XAuthTokenInterceptorService } from './x-auth-token-interceptor.service';
import { XAuthService } from '../x-auth/x-auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { EnvService } from '../../../../../shared/services/env/env.service';

describe('XAuthTokenInterceptorService', () => {
  let xAuthServiceSpy: jasmine.SpyObj<XAuthService>;
  let envServiceSpy: jasmine.SpyObj<EnvService>;
  let http: HttpClient;
  let httpController: HttpTestingController;
  let nonprodUrl: string;

  beforeEach(() => {
    nonprodUrl = 'http://nonprod.url/';
    xAuthServiceSpy = jasmine.createSpyObj('XAuthService', {
      token: Promise.resolve('aXAuthToken'),
      header: 'aHeaderName',
    });
    envServiceSpy = jasmine.createSpyObj('EnvService', { byKey: nonprodUrl });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        HttpClient,
        { provide: EnvService, useValue: envServiceSpy },
        { provide: HTTP_INTERCEPTORS, useClass: XAuthTokenInterceptorService, multi: true },
        { provide: XAuthService, useValue: xAuthServiceSpy },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should not add token header if url is not nonprod', fakeAsync(() => {
    const url = 'http://an-external-url.com/';
    http.get(url).subscribe((res) => expect(res).toEqual(1));
    tick();
    const request = httpController.expectOne({ method: 'GET', url });
    request.flush(1);
    expect(request.request.headers.has('aHeaderName')).toBeFalse();
  }));

  it('should add token header if url is not nonprod', fakeAsync(() => {
    const url = `${nonprodUrl}some-endpoint/`;
    http.get(url).subscribe((res) => expect(res).toEqual(1));
    tick();
    const request = httpController.expectOne({ method: 'GET', url });
    request.flush(1);
    expect(request.request.headers.get('aHeaderName')).toEqual('aXAuthToken');
  }));
});
