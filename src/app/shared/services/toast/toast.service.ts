import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async showToast(options: ToastOptions) {
    options = {
      duration: 4000,
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ],
      ...options
    };
    const toast = await this.toastController.create(options);
    toast.present();
  }
}
