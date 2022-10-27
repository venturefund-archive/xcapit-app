import { Component } from '@angular/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { ModalController, NavController } from '@ionic/angular';
import { TwoButtonsAlertComponent } from '../../../shared/components/two-buttons-alert/two-buttons-alert.component';
import { TranslateService } from '@ngx-translate/core';
import { VALIDATION_CONTENT } from '../shared-ramps/components/validation-content/validation-content.constant';

@Component({
  selector: 'app-kyc-front-id-validation',
  template: `
    <app-validation-content
      [data]="this.data"
      (backButton)="this.goBack()"
      (confirm)="this.goToConfirmation()"
    ></app-validation-content>
  `,
  styleUrls: ['./kyc-front-id-validation.page.scss'],
})
export class KycFrontIdValidationPage {
  data = VALIDATION_CONTENT.front_id;

  constructor(
    private trackService: TrackService,
    private navController: NavController,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  ionViewWillEnter() {
    this.trackScreenView();
  }

  private trackScreenView() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_buy_kripton_sv_id',
    });
  }

  goToConfirmation() {
    this.navController.navigateForward('/fiat-ramps/kyc-front-id-confirmation');
  }

  async goBack() {
    const modal = await this.modalController.create({
      component: TwoButtonsAlertComponent,
      cssClass: 'modal',
      backdropDismiss: false,
      componentProps: {
        title: this.translate.instant('fiat_ramps.kyc.front_id.back_modal.title'),
        description: this.translate.instant('fiat_ramps.kyc.front_id.back_modal.description'),
        confirmButton: this.translate.instant('fiat_ramps.kyc.front_id.back_modal.confirm_button'),
        cancelButton: this.translate.instant('fiat_ramps.kyc.front_id.back_modal.cancel_button'),
      },
    });

    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      await this.navController.navigateBack('/fiat-ramps/user-register');
    }
  }
}
