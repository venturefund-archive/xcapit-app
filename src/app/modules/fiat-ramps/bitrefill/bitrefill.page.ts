import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavController } from '@ionic/angular';
import { TwoButtonsAlertComponent } from 'src/app/shared/components/two-buttons-alert/two-buttons-alert.component';
import { LanguageService } from '../../../shared/services/language/language.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-bitrefill',
  template: `
    <ion-header class="b">
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-title class="ion-text-start">
          {{ 'fiat_ramps.bitrefill.header' | translate }}
        </ion-title>
        <ion-buttons class="b__buttons"slot="end">
          <ion-button class="b__buttons__button" name="goBack" (click)="this.navigateBack()">
            <ion-text class="ux-font-header-titulo">{{ 'fiat_ramps.bitrefill.exit_button' | translate }} </ion-text>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <iframe
        *ngIf="this.url !== undefined"
        [src]="this.url"
        frameborder="0"
        scrolling="yes"
        width="100%"
        height="100%"
      ></iframe>
    </ion-content>
  `,
  styleUrls: ['./bitrefill.page.scss'],
})
export class BitrefillPage {
  rootURL = 'https://www.bitrefill.com/embed/';
  url: SafeResourceUrl;
  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private navController: NavController,
    private languageService: LanguageService,
    private sanitizer: DomSanitizer
  ) {}

  ionViewWillEnter() {
    this.setURL();
  }

  async navigateBack() {
    const modal = await this.modalController.create({
      component: TwoButtonsAlertComponent,
      cssClass: 'modal',
      backdropDismiss: false,
      componentProps: {
        title: this.translate.instant('fiat_ramps.bitrefill.modal.title'),
        description: this.translate.instant('fiat_ramps.bitrefill.modal.description'),
        confirmButton: this.translate.instant('fiat_ramps.bitrefill.modal.confirm_button'),
        cancelButton: this.translate.instant('fiat_ramps.bitrefill.modal.cancel_button'),
      },
    });

    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      await this.navController.navigateBack('/tabs/wallets');
    }
  }

  async setURL() {
    const languageCode = await this.languageService.getSelectedLanguage();
    const rawURL = `${this.rootURL}?paymentMethod=ethereum&hl=${languageCode}`;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(rawURL);
  }
}
