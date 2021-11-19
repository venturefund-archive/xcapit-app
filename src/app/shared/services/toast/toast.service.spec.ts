import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

const successOptions: ToastOptions = {
  duration: 4000,
  cssClass: 'ux-toast success',
  buttons: [
    { icon: 'close', role: 'cancel', side: 'end' },
    { role: 'cancel', icon: 'ux-checked-circle-outline', side: 'start' },
  ],
};

const errorOptions: ToastOptions = {
  duration: 4000,
  cssClass: 'ux-toast error',
  buttons: [
    { icon: 'close', role: 'cancel', side: 'end' },
    { role: 'cancel', icon: 'ux-error-circle-outline', side: 'start' },
  ],
};

const warningOptions: ToastOptions = {
  duration: 4000,
  cssClass: 'ux-toast warning',
  buttons: [
    { icon: 'close', role: 'cancel', side: 'end' },
    { role: 'cancel', icon: 'ux-warning-circle-outline', side: 'start' },
  ],
};
const infoOptions: ToastOptions = {
  duration: 4000,
  cssClass: 'ux-toast info',
  buttons: [
    { icon: 'close', role: 'cancel', side: 'end' },
    { role: 'cancel', icon: 'ux-info-circle-outline', side: 'start' },
  ],
};

describe('ToastService', () => {
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let service: ToastService;
  beforeEach(() => {
    toastControllerSpy = jasmine.createSpyObj('ToastController', {
      create: Promise.resolve({ present: () => Promise.resolve() }),
    });
    TestBed.configureTestingModule({
      providers: [{ provide: ToastController, useValue: toastControllerSpy }],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call toast controller when show success toast', () => {
    service.showSuccessToast({});
    expect(toastControllerSpy.create).toHaveBeenCalledOnceWith(successOptions);
  });

  it('should call toast controller when show error toast', () => {
    service.showErrorToast({});
    expect(toastControllerSpy.create).toHaveBeenCalledOnceWith(errorOptions);
  });

  it('should call toast controller when show warning toast', () => {
    service.showWarningToast({});
    expect(toastControllerSpy.create).toHaveBeenCalledOnceWith(warningOptions);
  });

  it('should call toast controller when show info toast', () => {
    service.showInfoToast({});
    expect(toastControllerSpy.create).toHaveBeenCalledOnceWith(infoOptions);
  });
});
