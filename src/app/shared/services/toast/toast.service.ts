import { Injectable } from '@angular/core';
import { ToastButton, ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

export type ToastType = 'success' | 'successVerticalOffset' |'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly defaultOptions = {
    duration: 4000,
    cssClass: 'ux-toast',
    buttons: [
      {
        icon: 'close',
        role: 'cancel',
        side: 'end',
      } as ToastButton,
    ],
  };

  private readonly iconNames = {
    success: 'ux-checked-circle-outline',
    successVerticalOffset: 'ux-checked-circle-outline',
    error: 'ux-error-circle-outline',
    warning: 'ux-warning-circle-outline',
    info: 'ux-info-circle-outline',
  };

  constructor(private toastController: ToastController) {}

  async showToast(options: ToastOptions): Promise<any> {
    const toast = await this.toastController.create({ ...this.defaultOptions, ...options });
    return toast.present();
  }

  async dismiss() {
    try {
      await this.toastController.dismiss();
    } catch {
      //No implementation is required for this exception
    }
  }

  private optionsFor(type: ToastType): ToastOptions {
    const options: ToastOptions = Object.assign({}, this.defaultOptions);
    if (options.buttons.length === 2) {
      options.buttons.pop();
    }
    options.buttons.push({
      role: 'cancel',
      icon: this.iconNames[type],
      side: 'start',
    } as ToastButton);
    options.cssClass = `${options.cssClass} ${type}`;
    return options;
  }

  showSuccessToast(options: ToastOptions): Promise<any> {
    return this.showToast({ ...this.optionsFor('success'), ...options });
  }

  showSuccessToastVerticalOffset(options:ToastOptions): Promise<any> {
    return this.showToast({ ...this.optionsFor('successVerticalOffset'), ...options });
  }

  showErrorToast(options: ToastOptions): Promise<any> {
    return this.showToast({ ...this.optionsFor('error'), ...options });
  }

  showWarningToast(options: ToastOptions): Promise<any> {
    return this.showToast({ ...this.optionsFor('warning'), ...options });
  }

  showInfoToast(options: ToastOptions): Promise<any> {
    return this.showToast({ ...this.optionsFor('info'), ...options });
  }
}
