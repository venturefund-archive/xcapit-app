import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastAlertComponent } from 'src/app/shared/components/new-toasts/toast-alert/toast-alert.component';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';

@Component({
  selector: 'app-information-paxful',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/select-provider"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.information_paxful.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form class="ux_main" [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <div class="ux_content">
          <div>
            <ion-text class="ux-font-text-xl">
              {{ 'fiat_ramps.information_paxful.title' | translate }}
            </ion-text>
          </div>
          <div class="info_text">
            <ion-text color="neutral90" class="ux-font-text-xs">
              {{ 'fiat_ramps.information_paxful.subtitle' | translate }}
            </ion-text>
          </div>
          <ion-item lines="none">
            <div class="item">
              <app-ux-checkbox
                class="medium"
                ngClass="checkbox"
                controlName="responsibilityAccepted"
                slot="start"
              ></app-ux-checkbox>
            </div>
            <div class="text">
              <app-ux-text class="ip_text">
                {{ 'fiat_ramps.information_paxful.recordatory_1' | translate }}
              </app-ux-text>
            </div>
          </ion-item>
          <ion-item lines="none">
            <div class="item">
              <app-ux-checkbox
                class="medium"
                ngClass="checkbox"
                controlName="providerAccepted"
                slot="start"
              ></app-ux-checkbox>
            </div>
            <div class="text">
              <app-ux-text class="ip_text">
                {{ 'fiat_ramps.information_paxful.recordatory_2' | translate }}
              </app-ux-text>
            </div>
          </ion-item>
          <ion-item lines="none">
            <div class="item">
              <app-ux-checkbox
                class="medium"
                ngClass="checkbox"
                controlName="rateAccepted"
                slot="start"
              ></app-ux-checkbox>
            </div>
            <div class="text">
              <app-ux-text class="ip_text">
                {{ 'fiat_ramps.information_paxful.recordatory_3' | translate }}
              </app-ux-text>
            </div>
          </ion-item>
          <ion-item lines="none">
            <div class="item">
              <app-ux-checkbox
                class="medium"
                ngClass="checkbox"
                controlName="investmentAccepted"
                slot="start"
              ></app-ux-checkbox>
            </div>
            <div class="text">
              <app-ux-text class="ip_text">
                {{ 'fiat_ramps.information_paxful.recordatory_4' | translate }}
              </app-ux-text>
            </div>
          </ion-item>
        </div>
        <div class="ux_footer ion-padding">
          <div class="button-next">
            <ion-button class="ux_button" appTrackClick name="Acept" type="submit" color="secondary" size="large">
              {{ 'fiat_ramps.information_paxful.button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./information-paxful.page.scss'],
})
export class InformationPaxfulPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    responsibilityAccepted: [false, [Validators.requiredTrue]],
    providerAccepted: [false, [Validators.requiredTrue]],
    rateAccepted: [false, [Validators.requiredTrue]],
    investmentAccepted: [false, [Validators.requiredTrue]],
  });
  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  handleSubmit() {
    if (this.form.valid) {
      this.navController.navigateForward(['/fiat-ramps/new-operation-paxful']);
    } else if (this.form.invalid) {
      this.openModalAlert();
    }
  }

  async openModalAlert() {
    const modal = await this.modalController.create({
      component: ToastAlertComponent,
      cssClass: 'ux-alert',
      showBackdrop: false,
      componentProps: {
        title: this.translate.instant('fiat_ramps.information_paxful.modal_content'),
        type: 'error',
      },
    });
    await modal.present();
  }
}
