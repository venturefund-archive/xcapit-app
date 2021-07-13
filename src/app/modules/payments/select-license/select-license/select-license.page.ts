import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiPaymentsService } from '../../shared-payments/services/api-payments.service';
import { LICENSES } from '../constants/license';
@Component({
  selector: 'app-select-license',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center "> {{ 'payment.licenses.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="title">
          <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">
            {{ 'payment.licenses.title' | translate }}
          </ion-text>
        </div>
        <ion-text class="subtitle ux-font-roboto ux-fweight-regular ux-fsize-14">
          {{ 'payment.licenses.textPrimary' | translate }}
        </ion-text>
        <ion-text class="second-subtitle ux-font-roboto ux-fsize-14">
          {{ 'payment.licenses.textSecondary' | translate }}
        </ion-text>
        <div class="license_type">
          <ion-button
            [ngClass]="{ active: activeButtonAnnual }"
            class="license_type__anual_button ux-font-roboto ux-fweight-regular ux-fsize-14"
            name="anual"
            appTrackClick
            fill="clear"
            size="small"
            (click)="this.changeLicenses(this.annualState)"
            >{{ 'payment.licenses.btnAnnual' | translate }}</ion-button
          >
          <ion-button
            [ngClass]="{ active: activeButtonMonthly }"
            class="license_type__mensual_button ux-font-roboto ux-fweight-regular ux-fsize-14"
            name="mensual"
            appTrackClick
            fill="clear"
            size="small"
            (click)="this.changeLicenses(this.monthlyState)"
            >{{ 'payment.licenses.btnMonthly' | translate }}</ion-button
          >
        </div>
        <div class="ux_content">
          <div>
            <ion-list>
              <app-item-license
                *ngFor="let license of licenses"
                [license]="license"
                (click)="this.action(this.license.type)"
              ></app-item-license>
            </ion-list>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./select-license.page.scss'],
})
export class SelectLicensePage implements OnInit {
  licenses = LICENSES;
  stateAnnual: string;
  activeButtonAnnual = true;
  stateMonthly: string;
  activeButtonMonthly = true;
  annualState = 'payment.licenses.annual';
  monthlyState = 'payment.licenses.monthly';
  selectedLicense: string;
  paymentMethods = [];

  constructor(private navController: NavController, private apiPayment: ApiPaymentsService) {}

  ionViewWillEnter() {
    this.changeLicenses(this.annualState);
  }

  ngOnInit() {}

  changeLicenses(aState: string) {
    this.licenses = LICENSES;
    const filteredLicenses = this.licenses.filter((licenses) => licenses.state === aState || licenses.state === '');
    this.licenses = filteredLicenses;
    this.activatedBtn(aState === this.annualState);
  }

  activatedBtn(annual: boolean) {
    this.activeButtonAnnual = annual;
    this.stateAnnual = annual ? 'active' : '';
    this.activeButtonMonthly = !annual;
    this.stateMonthly = !annual ? 'active' : '';
  }

  action(type: string) {
    this.selectedLicense = type;
    this.apiPayment.getPaymentMethods().subscribe((res) => {
      res = this.paymentMethods;
    });
    if (this.selectedLicense === 'free' && this.paymentMethods?.length === 0) {
      this.apiPayment.registerLicense().subscribe(() => {
        this.getSuccessRoute();
      });
    }
  }

  getSuccessRoute() {
    return this.navController.navigateForward(['/payment/payment-success']);
  }
}
