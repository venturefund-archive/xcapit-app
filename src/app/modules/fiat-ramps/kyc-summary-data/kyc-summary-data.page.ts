import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';

@Component({
  selector: 'app-kyc-summary-data',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/user-register"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.kyc.summary_data.header' | translate }}
        </ion-title>
        <ion-label class="ux-font-text-xs sd__step_counter" slot="end"
          >4 {{ 'shared.step_counter.of' | translate }} 4</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="sd__container">
      <ion-progress-bar class="sd__container__progress" [value]="1" color="info"></ion-progress-bar>

      <div class="sd__container__provider">
        <ion-text class="ux-font-text-xxs">{{
          'fiat_ramps.kyc.user_personal_information.provider' | translate
        }}</ion-text>
      </div>
      <div class="sd__container__title">
        <ion-text class="ux-font-text-xl">{{ 'fiat_ramps.kyc.summary_data.title' | translate }}</ion-text>
      </div>

      <div class="sd__container__subtitle">
        <ion-text class="ux-font-text-base">{{ 'fiat_ramps.kyc.summary_data.subtitle' | translate }}</ion-text>
      </div>

      <div class="sd__container__title-data">
        <ion-text class="ux-font-text-lg">{{ 'fiat_ramps.kyc.summary_data.personal_data.title' | translate }}</ion-text>
      </div>
      <div class="user-basic-information">
        <app-user-basic-information
          *ngIf="this.data"
          [firstName]="this.data.firstName"
          [lastName]="this.data.lastName"
          [birthday]="this.data.birthday"
        ></app-user-basic-information>
      </div>
      <div class="user-personal-information">
        <app-user-personal-information
          *ngIf="this.data"
          [nationality]="this.data.nationality"
          [documentNumber]="this.data.document_number"
          [gender]="this.data.gender"
          [maritalStatus]="this.data.marital_status"
          [countryCode]="this.countryCode"
          [phoneNumber]="this.data.phone_number"
        ></app-user-personal-information>
      </div>
      <div class="sd__container__title-address">
        <ion-text class="ux-font-text-lg">{{ 'fiat_ramps.kyc.summary_data.address_data.title' | translate }}</ion-text>
      </div>
      <div class="user-address-information">
        <app-user-address-information
          *ngIf="this.data"
          [street]="this.data.street"
          [number]="this.data.number"
          [floor]="this.data.floor"
          [apartment]="this.data.apartment"
          [city]="this.data.city"
          [zipCode]="this.data.zipCode"
        >
        </app-user-address-information>
      </div>
    </ion-content>
    <ion-footer class="sd__footer">
      <div class="ux_footer ion-padding">
        <form [formGroup]="this.form">
          <ion-item class="term-item ion-no-padding ion-no-margin">
            <ion-checkbox
              appTrackClick
              formControlName="not_politically_exposed"
              mode="md"
              slot="start"
              name="ux_buy_kripton_politically_exposed"
            ></ion-checkbox>
            <ion-label class="ion-no-padding ion-no-margin">
              <ion-text class="ux-font-text-xs" color="neutral90">
                {{ 'fiat_ramps.kyc.summary_data.checkbox_politically_exposed' | translate }}
              </ion-text>
            </ion-label>
          </ion-item>
        </form>
        <div class="sd__footer__disclaimer">
          <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.kyc.summary_data.disclaimer' | translate }}</ion-text>
        </div>
        <ion-button
          name="ux_buy_kripton_details_confirm"
          class="ux_button"
          color="secondary"
          size="large"
          expand="block"
          [disabled]="!this.form.valid"
          (click)="this.sendData()"
        >
          {{ 'fiat_ramps.kyc.summary_data.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./kyc-summary-data.page.scss'],
})
export class KycSummaryDataPage implements OnInit {
  form: UntypedFormGroup = this.fb.group({
    not_politically_exposed: [false, Validators.requiredTrue],
  });
  data: any;
  countryCode: string;

  constructor(
    private fb: FormBuilder,
    private userKycKriptonDataService: UserKycKriptonDataService,
    private fiatRampsService: FiatRampsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this._loadData();
    this._formatCountryCode();
  }

  private _loadData(): void {
    this.data = this.userKycKriptonDataService.getData();
  }

  private _formatCountryCode() {
    this.countryCode = this.data.country_code.code;
    this.countryCode = this.countryCode.substring(this.countryCode.indexOf('('), this.countryCode.length);
  }

  private _parsedValues(formValues) {
    const valuesCopy = Object.assign({}, formValues);
    valuesCopy.country_code = this.countryCode;
    valuesCopy.gender = valuesCopy.gender.name;
    valuesCopy.marital_status = valuesCopy.marital_status.name;
    valuesCopy.document = valuesCopy.document.name;
    valuesCopy.nationality = valuesCopy.nationality.name;
    return valuesCopy;
  }

  sendData() {
    if (this.form.valid) {
      this.userKycKriptonDataService.updateData({ politically_exposed: !this.form.value.not_politically_exposed });
      this._loadData();
      this.fiatRampsService.registerUserInfo(this._parsedValues(this.data)).subscribe(() => {
        this.navController.navigateForward('fiat-ramps/user-register');
      });
    }
  }
}
