import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { ToastService } from '../toast/toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorHandlerService', () => {
  let toastServiceSpy: any;
  let service: ErrorHandlerService;
  let toastService: ToastService;
  beforeEach(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showErrorToast']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ToastService, useValue: toastServiceSpy }],
    });
    service = TestBed.inject(ErrorHandlerService);
    toastService = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call showErrorToast ToastService from error, status null', () => {
    const response = new HttpErrorResponse({ status: 401, error: {} });
    service.handle(response);
    expect(toastService.showErrorToast).toHaveBeenCalledTimes(0);
  });

  it('should call showErrorToast ToastService from error, status 401', () => {
    const response = new HttpErrorResponse({
      status: 401,
      error: { error_code: 'funds.exmapleError' },
    });
    service.handle(response);
    expect(toastService.showErrorToast).toHaveBeenCalledTimes(1);
  });
});
