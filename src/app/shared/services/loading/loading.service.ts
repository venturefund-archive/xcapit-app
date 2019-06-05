import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private message: string;

  private defaultMessage = 'Cargando...';

  private loading: HTMLIonLoadingElement;

  private isVisible: boolean;
  private isEnabled: boolean;

  constructor(private loadingController: LoadingController) {}

  async show(options: LoadingOptions = {}) {
    if (!this.isVisible && this.isEnabled) {
      this.isVisible = true;
      options = { message: this.message || this.defaultMessage, ...options };
      this.loading = await this.loadingController.create(options);
      if (this.isVisible) {
        this.loading.present();
      }
    }
  }

  dismiss() {
    if (this.isVisible) {
      this.isVisible = false;
      if (this.loading) {
        this.loading.dismiss();
      }
      this.message = null;
    }
  }

  enabled() {
    this.isEnabled = true;
  }

  disabled() {
    this.isEnabled = false;
  }

  setMessage(message: string) {
    this.message = message;
  }
}
