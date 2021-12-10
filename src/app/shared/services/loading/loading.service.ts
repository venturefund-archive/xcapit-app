import { Injectable } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from 'src/app/config/app-constants.config';
import { LoadingModalComponent } from '../../components/loading-modal/loading-modal.component';

export interface LoadingModalOptions {
  title: string;
  subtitle: string;
  image: string;
}
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private message: string;

  private defaultMessage = CONFIG.loadingService.defaultMessage;

  private loading: HTMLIonLoadingElement;

  private isVisible: boolean;
  private isEnabled: boolean;

  constructor(
    private loadingController: LoadingController,
    private translate: TranslateService,
    private modalController: ModalController
  ) {}

  async showModal(options: LoadingModalOptions) {
    const modal = await this.modalController.create({
      component: LoadingModalComponent,
      componentProps: options,
    });
    await modal.present();
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }

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
        await this.loading.present();
      }
    }
  }

  async dismiss() {
    if (this.isVisible) {
      this.isVisible = false;
      if (this.loading) {
        await this.loading.dismiss();
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
