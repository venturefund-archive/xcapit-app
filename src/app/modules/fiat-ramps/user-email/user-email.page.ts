import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';

@Component({
  selector: 'app-user-email',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/new-operation/moonpay"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.user_email.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ue__container">
      <div class="ue__container__provider">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.user_email.provider' | translate }}</ion-text>
      </div>
      <div class="ue__container__icon">
        <img src="assets/img/provider-logos/KriptonMarket.svg" />
      </div>
      <div class="ue__container__title">
        <ion-text class="ux-font-text-lg">{{ 'fiat_ramps.user_email.title' | translate }}</ion-text>
      </div>
      <div class="ue__container__subtitle">
        <ion-text class="ux-font-text-base">{{ 'fiat_ramps.user_email.subtitle' | translate }}</ion-text>
      </div>
      <div class="ue__container__form">
        <form [formGroup]="this.form">
          <app-ux-input
            controlName="email"
            type="email"
            inputmode="email"
            [label]="'fiat_ramps.user_email.label_email' | translate"
            aria-label="email"
            tabindex="0"
            color="primary"
          ></app-ux-input>
        </form>
      </div>
      <div class="ue__container__card">
        <app-backup-information-card
          [text]="'fiat_ramps.user_email.text'"
          [textClass]="'ux-home-backup-card'"
          [backgroundClass]="'ux-white-background-card'"
        >
        </app-backup-information-card>
      </div>
    </ion-content>
    <ion-footer class="ue__footer">
      <div class="ux_footer ion-padding">
        <ion-button
          class="ux_button"
          appTrackClick
          name="ux_user_mail_continue"
          color="secondary"
          size="large"
          expand="block"
          [disabled]="!this.form.valid"
          (click)="this.checkKYCAndRedirect()"
        >
          {{ 'fiat_ramps.user_email.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./user-email.page.scss'],
})
export class UserEmailPage implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
  });
  constructor(
    private formBuilder: UntypedFormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private storageOperationService: StorageOperationService
  ) {}

  ngOnInit() {}

  async checkKYCAndRedirect() {
    const userStatus = await this.fiatRampsService.getOrCreateUser(this.form.value).toPromise();
    this.saveEmail();
    this.redirectByStatus(userStatus.registration_status);
  }

  redirectByStatus(registrationStatus: string) {
    const url = RegistrationStatus[registrationStatus];
    this.navController.navigateForward(url);
  }

  saveEmail() {
    const newData = Object.assign({ email: this.form.value.email }, this.storageOperationService.getData());
    this.storageOperationService.updateData(newData);
  }
}
