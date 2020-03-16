import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from 'src/app/config/app-constants.config';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private message: string;

  private defaultMessage = CONFIG.loadingService.defaultMessage;

  private loading: HTMLIonLoadingElement;

  private isVisible: boolean;
  private isEnabled: boolean;

  constructor(
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {}

  async show(options: LoadingOptions = {}) {
    options.cssClass = 'ux-loading';
    options.message = '';
    options.spinner = null;
    if (!this.isVisible && this.isEnabled) {
      this.isVisible = true;
      const msg = this.message || this.defaultMessage;
      options = { message: this.translate.instant(msg), ...options };
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
