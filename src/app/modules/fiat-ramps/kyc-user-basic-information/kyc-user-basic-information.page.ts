import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { UserKycKriptonData } from '../shared-ramps/interfaces/user-kyc-kripton-data.interface';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';
@Component({
  selector: 'app-kyc-user-basic-information',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/user-register"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.kyc.user_basic.header' | translate }}
        </ion-title>
        <ion-label class="ux-font-text-xs ux_toolbar__step" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} 4</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ubi__container">
      <ion-progress-bar class="ubi__container__progress" [value]="0.25" color="info"></ion-progress-bar>

      <div class="ubi__container__provider">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.kyc.user_basic.provider' | translate }}</ion-text>
      </div>
      <div class="ubi__container__title">
        <ion-text class="ux-font-text-xl">{{ 'fiat_ramps.kyc.user_basic.title' | translate }}</ion-text>
      </div>
      <div class="ubi__container__subtitle">
        <ion-text class="ux-font-text-lg"
          >{{ 'fiat_ramps.kyc.user_basic.subtitle' | translate }}
          <ion-icon name="information-circle" color="info"></ion-icon>
        </ion-text>
      </div>
      <div class="ubi__container__form">
        <form [formGroup]="this.form">
          <app-ux-input
            controlName="first_name"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.kyc.user_basic.label_first_name' | translate"
            color="primary"
          ></app-ux-input>
          <app-ux-input
            controlName="last_name"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.kyc.user_basic.label_last_name' | translate"
            color="primary"
          ></app-ux-input>
          <app-ux-input
            controlName="birthday"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.kyc.user_basic.label_birthday' | translate"
            [placeholder]="'fiat_ramps.kyc.user_basic.placeholder_birthday' | translate"
            color="primary"
          ></app-ux-input>
        </form>
      </div>
    </ion-content>
    <ion-footer class="ubi__footer">
      <div class="ux_footer ion-padding">
        <ion-button
          class="ux_button"
          color="secondary"
          size="large"
          expand="block"
          [disabled]="!this.form.valid"
          (click)="this.nextPage()"
        >
          {{ 'fiat_ramps.kyc.user_basic.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./kyc-user-basic-information.page.scss'],
})
export class KycUserBasicInformationPage implements OnInit {
  form: UntypedFormGroup = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("[A-Za-zÀ-ÿ '-]*$")]],
    last_name: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("[A-Za-zÀ-ÿ '-]*$")]],
    birthday: [
      '',
      [
        Validators.required,
        CustomValidators.isDate(),
        Validators.pattern('(0?[1-9]|1[0-2])/(0?[1-9]|[1-2][0-9]|3[0,1])/[1-2]([0-9]){3}'),
      ],
    ],
  });

  data: UserKycKriptonData;

  constructor(
    private fb: FormBuilder,
    private trackService: TrackService,
    private userKycKriptonDataService: UserKycKriptonDataService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.data = this.userKycKriptonDataService.getData();
    this._showData();
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_buy_kripton_screenview_details',
    });
  }

  nextPage() {
    this.userKycKriptonDataService.updateData({
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name,
      birthday: this.form.value.birthday,
    });
    this.navController.navigateForward('fiat-ramps/user-personal-information');
  }

  private _showData() {
    if (this.form.value.first_name !== '') {
      this.form.patchValue({
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        birthday: this.data.birthday,
      });
    }
  }
}
