import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FiatRampOperation } from '../../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampsService } from '../../shared-ramps/services/fiat-ramps.service';
@Component({
  selector: 'app-select-provider',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'fiat_ramps.select_provider.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="ux_content">
          <form [formGroup]="this.form">
            <app-select-provider-card
              (route)="this.receiveRoute($event)"
              (changedCountry)="this.resetForm()"
              controlNameProvider="provider"
              controlNameSelect="country"
            ></app-select-provider-card>
          </form>
        </div>
        <div class="operations-list ion-padding-start ion-padding-end" *ngIf="this.operationsList">
          <app-operations-list [operationsList]="this.operationsList"></app-operations-list>
        </div>
        <div class="moonpay-operations ion-padding-start ion-padding-end">
          <ion-text class="ux-font-text-xxs">
            {{ 'fiat_ramps.moonpay.moonpay_operations' | translate }}
          </ion-text>
          <ion-button
            size="small"
            fill="clear"
            type="button"
            appTrackClick
            name="Go To Moonpay History"
            (click)="this.goToMoonpay()"
            class="ux-link-xs ion-no-padding ion-no-margin moonpay-operations__link"
          >
            {{ this.txHistoryLink }}
          </ion-button>
        </div>
        <div class="ux_footer ion-padding">
          <ion-button
            class="ux_button"
            appTrackClick
            name="ux_vendor_buy_continue"
            color="secondary"
            size="large"
            expand="block"
            (click)="this.goToRoute()"
            [disabled]="!this.form.valid"
          >
            {{ 'fiat_ramps.select_provider.button' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./select-provider.page.scss'],
})
export class SelectProviderPage {
  form: UntypedFormGroup = this.formBuilder.group({
    country: ['', [Validators.required]],
    provider: ['', [Validators.required]],
  });
  route: string;
  disabled: boolean;
  operationsList: FiatRampOperation[];
  txHistoryLink: string = LINKS.moonpayTransactionHistory;

  constructor(
    private navController: NavController,
    private formBuilder: UntypedFormBuilder,
    private trackService: TrackService,
    private browserService: BrowserService,
    private fiatRampsService: FiatRampsService,
  ) {}

  ionViewWillEnter() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_screenview_buy',
    });

    this.getOperations();
  }

  getOperations() {
    this.fiatRampsService.getUserOperations().subscribe((data) => {
      this.operationsList = data;
    });
  }

  receiveRoute(route: string) {
    this.route = route;
  }

  goToRoute() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        country: this.form.value.country.isoCodeAlpha3,
      },
    };

    this.navController.navigateForward([this.route], navigationExtras);
  }

  resetForm() {
    this.form.get('provider').reset();
  }

  async goToMoonpay() {
    await this.browserService.open({ url: this.txHistoryLink });
  }
}
