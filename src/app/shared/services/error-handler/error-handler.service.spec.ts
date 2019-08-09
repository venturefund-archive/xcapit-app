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
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ToastService, useValue: toastServiceSpy }]
    });
    service = TestBed.get(ErrorHandlerService);
    toastService = TestBed.get(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call showToast ToastService from error, status null', () => {
    const response = new HttpErrorResponse({ status: 401, error: {} });
    service.handle(response);
    expect(toastService.showToast).toHaveBeenCalledTimes(1);
  });

  it('should call showToast ToastService from error, status 401', () => {
    const response = new HttpErrorResponse({ status: 401, error: {error_code: 'funds.exmapleError'} });
    service.handle(response);
    expect(toastService.showToast).toHaveBeenCalledTimes(1);
  });
});
