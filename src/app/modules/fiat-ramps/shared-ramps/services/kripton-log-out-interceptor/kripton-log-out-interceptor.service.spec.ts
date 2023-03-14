import { KriptonLogOutInterceptorService } from './kripton-log-out-interceptor.service';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { KriptonStorageService } from '../kripton-storage/kripton-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { EnvService } from 'src/app/shared/services/env/env.service';

describe('KriptonLogOutInterceptorService', () => {
  let service: KriptonLogOutInterceptorService;
  let requestMock: HttpRequest<any>;
  let handlerSpy: jasmine.SpyObj<HttpHandler>;
  let storageSpy: jasmine.SpyObj<KriptonStorageService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  let envSpy: jasmine.SpyObj<EnvService>;
  const urlKripton = 'testUrl/on_off_ramps/provider/get_all_operations';
  const urlOther = 'https://api.covalenthq.com/v1/';

  beforeEach(() => {
    handlerSpy = jasmine.createSpyObj('HttpHandler', {
      handle: throwError(new HttpErrorResponse({ url: urlKripton, status: 401 })),
    });
    requestMock = new HttpRequest('GET', urlKripton);
    storageSpy = jasmine.createSpyObj('KriptonStorageService', {
      removeCredentials: Promise.resolve(),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showWarningToast: Promise.resolve(),
    });
    translateSpy = jasmine.createSpyObj('TranslateService', {
      instant: Promise.resolve(),
    });
    envSpy = jasmine.createSpyObj('EnvService', {
      byKey: 'testUrl',
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: KriptonStorageService, useValue: storageSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: EnvService, useValue: envSpy },
      ],
    });
    service = TestBed.inject(KriptonLogOutInterceptorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should intercept kripton only', async () => {
    await service.intercept(requestMock, handlerSpy).toPromise();
    expect(storageSpy.removeCredentials).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/tabs/wallets']);
    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledTimes(1);
  });

  it('should not intercept other http requests', async () => {
    handlerSpy.handle.and.throwError(new HttpErrorResponse({ url: urlOther, status: 500 }));
    try {
      await service.intercept(requestMock, handlerSpy).toPromise();
    } catch (error) {undefined}
    expect(storageSpy.removeCredentials).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateRoot).not.toHaveBeenCalled();
    expect(toastServiceSpy.showWarningToast).not.toHaveBeenCalled();
  });
});
