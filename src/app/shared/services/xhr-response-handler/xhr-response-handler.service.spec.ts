import { TestBed } from '@angular/core/testing';

import { XhrResponseHandlerService } from './xhr-response-handler.service';
import { ToastService } from '../toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

describe('XhrResponseHandlerService', () => {
  let toastServiceSpy: any;
  let service: XhrResponseHandlerService;
  let toastService: ToastService;
  beforeEach(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    });
    service = TestBed.get(XhrResponseHandlerService);
    toastService = TestBed.get(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call showToast ToastService from error, status null', () => {
    const response = new HttpErrorResponse({});
    service.error()(response);
    expect(toastService.showToast).toHaveBeenCalledTimes(1);
  });

  it('should call showToast ToastService from error, status 401', () => {
    const response = new HttpErrorResponse({ status: 401, error: 'error' });
    service.error()(response);
    expect(toastService.showToast).toHaveBeenCalledTimes(1);
  });
});
