import { KriptonLogOutInterceptorService } from './kripton-log-out-interceptor.service';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { KriptonStorageService } from '../kripton-storage/kripton-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { FiatRampsService } from '../fiat-ramps.service';

describe('KriptonLogOutInterceptorService', () => {
  let service: KriptonLogOutInterceptorService;
  let requestMock: HttpRequest<any>;
  let handlerSpy: jasmine.SpyObj<HttpHandler>;
  let storageSpy: jasmine.SpyObj<KriptonStorageService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let envSpy: jasmine.SpyObj<EnvService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  const urlKripton = 'testUrl/on_off_ramps/provider/get_all_operations';
  const urlOther = 'https://api.covalenthq.com/v1/';
  const requestError = throwError(new HttpErrorResponse({ url: urlKripton, status: 401 }));
  beforeEach(() => {
    handlerSpy = jasmine.createSpyObj('HttpHandler', {
      handle: requestError,
    });

    requestMock = new HttpRequest('GET', urlKripton);
    storageSpy = jasmine.createSpyObj('KriptonStorageService', {
      removeCredentials: Promise.resolve(),
      renewTokens: Promise.resolve(),
      get: Promise.resolve(''),
    });
    storageSpy.get.withArgs('access_token').and.resolveTo('an_access_token');
    storageSpy.get.withArgs('refresh_token').and.resolveTo('a_refresh_token');
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showWarningToast: Promise.resolve(),
    });
    envSpy = jasmine.createSpyObj('EnvService', {
      byKey: 'testUrl',
    });
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      refreshToken: of({ access_token: 'an_access_token', refresh_token: 'a_refresh_token' }),
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: KriptonStorageService, useValue: storageSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: EnvService, useValue: envSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
      ],
    });
    service = TestBed.inject(KriptonLogOutInterceptorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should not intercept other http requests', async () => {
    handlerSpy.handle.and.returnValue(throwError(new HttpErrorResponse({ url: urlOther, status: 500 })));
    try {
      await service.intercept(requestMock, handlerSpy).toPromise();
    } catch (error) {
      undefined;
    }
    expect(storageSpy.removeCredentials).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateRoot).not.toHaveBeenCalled();
    expect(toastServiceSpy.showWarningToast).not.toHaveBeenCalled();
  });

  it('should logout when refresh token fails', async () => {
    fiatRampsServiceSpy.refreshToken.and.throwError(new HttpErrorResponse({ status: 400 }));
    try {
      await service.intercept(requestMock, handlerSpy).toPromise();
    } catch (error) {
      undefined;
    }
    expect(storageSpy.removeCredentials).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/tabs/wallets']);
    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledOnceWith({
      message: 'shared.services.kripton_interceptor.session_expired_toast',
    });
  });

  it('should renew tokens in storage and repeat request with new access token', async () => {
    handlerSpy.handle.and.returnValues(requestError, of(new HttpResponse({ status: 200 })));
    await service.intercept(requestMock, handlerSpy).toPromise();
    expect(storageSpy.renewTokens).toHaveBeenCalledOnceWith('an_access_token', 'a_refresh_token');
    expect(handlerSpy.handle).toHaveBeenCalledTimes(2);
  });
});
