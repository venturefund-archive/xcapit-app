import { Component } from '@angular/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { ModalController, NavController } from '@ionic/angular';
import { TwoButtonsAlertComponent } from '../../../shared/components/two-buttons-alert/two-buttons-alert.component';
import { TranslateService } from '@ngx-translate/core';
import { VALIDATION_CONTENT } from '../shared-ramps/components/validation-content/validation-content.constant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kyc-validation',
  template: `
    <app-validation-content
      *ngIf="this.data"
      [data]="this.data"
      (backButton)="this.goBack()"
      (confirm)="this.goToConfirmation()"
    ></app-validation-content>
  `,
  styleUrls: ['./kyc-validation.page.scss'],
})
export class KycValidationPage {
  validationContent = VALIDATION_CONTENT;
  data: any;
  digitalDocument: string;
  modalOpened: boolean;
  constructor(
    private route: ActivatedRoute,
    private trackService: TrackService,
    private navController: NavController,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  ionViewWillEnter() {
    this.digitalDocument = this.route.snapshot.paramMap.get('digitalDocument');
    this.data = this.validationContent[this.digitalDocument];
    this.trackScreenView();
  }

  private trackScreenView() {
    if (this.digitalDocument === 'front_id') { 
      this.trackService.trackEvent({
        eventAction: 'screenview',
        description: window.location.href,
        eventLabel: 'ux_buy_kripton_sv_id',
      });
    }
  }

  goToConfirmation() {
    this.navController.navigateForward(`/fiat-ramps/kyc/confirmation/${this.digitalDocument}`);
  }

  async goBack() {
    if(!this.modalOpened){
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
      this.modalOpened = true;
      const { role } = await modal.onDidDismiss();
      this.modalOpened = false;
      if (role === 'confirm') {
        await this.navController.navigateBack('/fiat-ramps/user-register');
      }
    }
  }
}
