import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UserKycKriptonData } from '../shared-ramps/interfaces/user-kyc-kripton-data.interface';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';

@Component({
  selector: 'app-kyc-user-address-information',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/user-register"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.kyc.user_address.header' | translate }}
        </ion-title>
        <ion-label class="ux-font-text-xs uai__step_counter" slot="end"
          >3 {{ 'shared.step_counter.of' | translate }} 4</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="uai__container">
      <ion-progress-bar class="uai__container__progress" [value]="0.75" color="info"></ion-progress-bar>

      <div class="uai__container__provider">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.kyc.user_address.provider' | translate }}</ion-text>
      </div>
      <div class="uai__container__title">
        <ion-text class="ux-font-text-xl">{{ 'fiat_ramps.kyc.user_address.title' | translate }}</ion-text>
      </div>
      <div class="uai__container__subtitle">
        <ion-text class="ux-font-text-lg"
          >{{ 'fiat_ramps.kyc.user_address.subtitle' | translate }}
          <ion-icon name="information-circle" color="info"></ion-icon>
        </ion-text>
      </div>
      <div class="uai__container__form">
        <form [formGroup]="this.form">
          <app-ux-input
            controlName="street"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.kyc.user_address.label_street' | translate"
            color="primary"
          ></app-ux-input>
          <div class="uai__container__form__group">
            <app-ux-input
              controlName="number"
              type="text"
              inputmode="number"
              [label]="'fiat_ramps.kyc.user_address.label_number' | translate"
              color="primary"
            ></app-ux-input>
            <app-ux-input
              controlName="floor"
              type="text"
              inputmode="text"
              [label]="'fiat_ramps.kyc.user_address.label_floor' | translate"
              color="primary"
            ></app-ux-input>
            <app-ux-input
              controlName="apartment"
              type="text"
              inputmode="text"
              [label]="'fiat_ramps.kyc.user_address.label_apartment' | translate"
              color="primary"
            ></app-ux-input>
          </div>
          <app-ux-input
            controlName="city"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.kyc.user_address.label_city' | translate"
            color="primary"
          ></app-ux-input>
          <app-ux-input
            controlName="zipCode"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.kyc.user_address.label_zip_code' | translate"
            color="primary"
          ></app-ux-input>
        </form>
      </div>
    </ion-content>
    <ion-footer class="uai__footer">
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
  styleUrls: ['./kyc-user-address-information.page.scss'],
})
export class KycUserAddressInformationPage implements OnInit {
  form: UntypedFormGroup = this.fb.group({
    street: ['', [Validators.required, Validators.maxLength(150)]],
    number: ['', [Validators.required, Validators.maxLength(150), Validators.pattern('[0-9]*$')]],
    floor: ['', [Validators.maxLength(150)]],
    apartment: ['', [Validators.maxLength(150)]],
    city: ['', [Validators.required, Validators.maxLength(150)]],
    zipCode: ['', [Validators.required, Validators.maxLength(150)]],
  });
  data: UserKycKriptonData;

  constructor(
    private fb: FormBuilder,
    private userKycKriptonDataService: UserKycKriptonDataService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.data = this.userKycKriptonDataService.getData();
    this.showData();
  }

  nextPage() {
    this.userKycKriptonDataService.updateData(this.form.value);
    this.navController.navigateForward('fiat-ramps/summary-data');
  }

  showData() {
    this.form.patchValue({
      street: this.data.street,
      number: this.data.number,
      floor: this.data.floor,
      apartment: this.data.apartment,
      city: this.data.city,
      zipCode: this.data.zipCode,
    });
  }
}
