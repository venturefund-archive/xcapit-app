import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiPaymentsService } from '../../shared-payments/services/api-payments.service';
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
            (click)="this.changePlans(this.annualFrequency)"
            >{{ 'payment.licenses.btnAnnual' | translate }}</ion-button
          >
          <ion-button
            [ngClass]="{ active: activeButtonMonthly }"
            class="license_type__mensual_button ux-font-roboto ux-fweight-regular ux-fsize-14"
            name="mensual"
            appTrackClick
            fill="clear"
            size="small"
            (click)="this.changePlans(this.monthlyFrequency)"
            >{{ 'payment.licenses.btnMonthly' | translate }}</ion-button
          >
        </div>
        <div class="ux_content">
          <div>
            <ion-list>
              <app-item-license
                *ngFor="let plan of filteredPlans"
                [plan]="plan"
                (click)="this.action(this.plan.type, this.plan.id)"
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
  subscriptionPlans = [];
  filteredPlans = [];
  stateAnnual: string;
  activeButtonAnnual = true;
  stateMonthly: string;
  activeButtonMonthly = true;
  annualFrequency = 'years';
  monthlyFrequency = 'months';
  selectedPlan: string;

  constructor(private navController: NavController, private apiPayment: ApiPaymentsService) {}

  ionViewWillEnter() {
    this.getSubscriptionPlans();
  }

  ngOnInit() {}

  getSubscriptionPlans() {
    this.apiPayment.getSubscriptionPlans().subscribe((res) => {
      this.subscriptionPlans = res;
      this.changePlans(this.annualFrequency);
    });
  }

  changePlans(frequency: string) {
    const filteredPlans = this.subscriptionPlans.filter(
      (plans) => plans.frequency_type === frequency || plans.frequency === ''
    );
    this.filteredPlans = filteredPlans;
    this.activatedBtn(frequency === this.annualFrequency);
  }

  activatedBtn(annual: boolean) {
    this.activeButtonAnnual = annual;
    this.stateAnnual = annual ? 'active' : '';
    this.activeButtonMonthly = !annual;
    this.stateMonthly = !annual ? 'active' : '';
  }

  action(type: string, licenseID: string) {
    this.selectedPlan = type;
    if (this.selectedPlan === 'free') {
      this.apiPayment.registerLicense().subscribe(() => {
        this.getSuccessRoute();
      });
    } else if (this.selectedPlan === 'paid') {
      this.getPaymentRoute(licenseID);
    }
  }

  getSuccessRoute() {
    return this.navController.navigateForward(['/payment/payment-success']);
  }

  getPaymentRoute(planID: string) {
    return this.navController.navigateForward(['/payment/payment-methods', planID]);
  }
}
