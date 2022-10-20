import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { COUNTRY_CODE } from '../constants/conutry_code';
import { DOC_TYPES } from '../constants/doc_types';
import { GENDERS } from '../constants/gender';
import { MARITAL_STATUS } from '../constants/marital-status';
import { Countries } from '../enums/countries.enum';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';

@Component({
  selector: 'app-kyc-user-basic-information-step2',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/user-register"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.kyc.user_personal_information.header' | translate }}
        </ion-title>
        <ion-label class="ux-font-text-xs ubis__step_counter" slot="end"
          >2 {{ 'shared.step_counter.of' | translate }} 4</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ubis__container">
      <ion-progress-bar class="ubis__container__progress" [value]="0.5" color="info"></ion-progress-bar>

      <div class="ubis__container__provider">
        <ion-text class="ux-font-text-xxs">{{
          'fiat_ramps.kyc.user_personal_information.provider' | translate
        }}</ion-text>
      </div>
      <div class="ubis__container__title">
        <ion-text class="ux-font-text-xl">{{ 'fiat_ramps.kyc.user_personal_information.title' | translate }}</ion-text>
      </div>
      <div class="ubis__container__subtitle">
        <ion-text class="ux-font-text-lg"
          >{{ 'fiat_ramps.kyc.user_personal_information.subtitle' | translate }}
          <ion-icon name="information-circle" color="info"></ion-icon>
        </ion-text>
      </div>
      <div class="ubis__container__form">
        <form [formGroup]="this.form">
          <app-input-select
            [label]="'fiat_ramps.kyc.user_personal_information.label_nationality' | translate"
            [modalTitle]="'fiat_ramps.kyc.user_personal_information.label_nationality' | translate"
            [placeholder]="'fiat_ramps.kyc.user_personal_information.general_placeholder' | translate"
            controlName="nationality"
            [data]="this.countries"
            [selectorStyle]="'new-style'"
            key="value"
            valueKey="value"
            [translated]="true"
          ></app-input-select>
          <div class="ubis__container__form__document">
            <div class="ubis__container__form__document__input-select">
              <app-input-select
                [label]="'fiat_ramps.kyc.user_personal_information.label_document' | translate"
                [modalTitle]="'fiat_ramps.kyc.user_personal_information.modal_title_document' | translate"
                [placeholder]="'fiat_ramps.kyc.user_personal_information.placeholder_document' | translate"
                controlName="document"
                [data]="this.docTypes"
                [selectorStyle]="'new-style'"
                key="value"
                valueKey="value"
                [translated]="true"
              ></app-input-select>
            </div>
            <div class="ubis__container__form__document__input">
              <app-ux-input
                controlName="document_number"
                type="number"
                inputmode="numeric"
                color="primary"
              ></app-ux-input>
            </div>
          </div>
          <app-input-select
            [label]="'fiat_ramps.kyc.user_personal_information.label_gender' | translate"
            [modalTitle]="'fiat_ramps.kyc.user_personal_information.label_gender' | translate"
            [placeholder]="'fiat_ramps.kyc.user_personal_information.general_placeholder' | translate"
            controlName="gender"
            [data]="this.genders"
            [selectorStyle]="'new-style'"
            key="value"
            valueKey="value"
            [translated]="true"
          ></app-input-select>
          <app-input-select
            [label]="'fiat_ramps.kyc.user_personal_information.label_marital_status' | translate"
            [modalTitle]="'fiat_ramps.kyc.user_personal_information.label_marital_status' | translate"
            [placeholder]="'fiat_ramps.kyc.user_personal_information.general_placeholder' | translate"
            controlName="marital_status"
            [data]="this.maritalStatus"
            [selectorStyle]="'new-style'"
            key="value"
            valueKey="value"
            [translated]="true"
          ></app-input-select>
          <div class="ubis__container__form__phone">
            <div class="ubis__container__form__phone__input-select">
              <app-input-select
                [label]="'fiat_ramps.kyc.user_personal_information.label_country_code' | translate"
                [modalTitle]="'fiat_ramps.kyc.user_personal_information.label_country_code' | translate"
                controlName="country_code"
                [data]="this.countryCode"
                [selectorStyle]="'new-style'"
                key="code"
                valueKey="code"
                [translated]="true"
              ></app-input-select>
            </div>
            <div class="ubis__container__form__phone__input">
              <app-ux-input
                [label]="'fiat_ramps.kyc.user_personal_information.label_phone' | translate"
                controlName="phone_number"
                type="number"
                inputmode="numeric"
                color="primary"
              ></app-ux-input>
            </div>
          </div>
        </form>
      </div>
    </ion-content>
    <ion-footer class="ubis__footer">
      <div class="ux_footer ion-padding">
        <ion-button
          class="ux_button"
          color="secondary"
          size="large"
          expand="block"
          [disabled]="!this.form.valid"
          (click)="this.nextPage()"
        >
          {{ 'fiat_ramps.kyc.user_personal_information.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./kyc-user-personal-information.page.scss'],
})
export class KycUserPersonalInformationPage implements OnInit {
  form: UntypedFormGroup = this.fb.group({
    nationality: ['', [Validators.required]],
    document: ['', [Validators.required]],
    document_number: [
      '',
      [Validators.required, Validators.minLength(7), Validators.maxLength(12), Validators.pattern('[0-9]*$')],
    ],
    gender: ['', [Validators.required]],
    marital_status: ['', [Validators.required]],
    country_code: ['', [Validators.required]],
    phone_number: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern('[0-9]*$')],
    ],
  });
  countries: any = COUNTRIES.filter((country) => country.name === 'Argentina');
  maritalStatus = MARITAL_STATUS;
  genders = GENDERS;
  docTypes = DOC_TYPES;
  countryCode = COUNTRY_CODE;

  constructor(
    private fb: FormBuilder,
    private trackService: TrackService,
    private userKycKriptonDataService: UserKycKriptonDataService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_buy_kripton_screenview_details',
    });
  }
  nextPage() {
    console.log(this.form.value);
  }
}
