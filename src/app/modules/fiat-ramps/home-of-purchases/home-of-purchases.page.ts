import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';

@Component({
  selector: 'app-home-of-purchases',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.home_of_purchases.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="hop">
      <div class="hop__operations-list ion-padding" *ngIf="this.operationsList">
        <app-operations-list [operationsList]="this.operationsList"></app-operations-list>
      </div>
      <div class="hop__moonpay-purchases ion-padding-start ion-padding-end">
        <app-moonpay-purchases-card></app-moonpay-purchases-card>
      </div>
      <div class="hop__question ion-padding-start ion-padding-end">
        <ion-text (click)="goToFaqs()" class="ux-link-xs">{{
          'fiat_ramps.home_of_purchases.question' | translate
        }}</ion-text>
      </div>
    </ion-content>
    <ion-footer>
      <div class="hop__button ion-padding">
        <ion-button
          class="ux_button"
          appTrackClick
          name="ux_buy_kripton_new"
          color="secondary"
          expand="block"
          (click)="this.handler()"
        >
          {{ 'fiat_ramps.home_of_purchases.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./home-of-purchases.page.scss'],
})
export class HomeOfPurchasesPage {
  providers: FiatRampProvider[];
  operationsList: FiatRampOperation[];

  constructor(
    private fiatRampsService: FiatRampsService,
    private providersFactory: ProvidersFactory,
    private tokenOperationDataService: TokenOperationDataService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.getProviders();
    if (this.kriptonEnabled()) this.getOperations();
  }

  getOperations() {
    this.fiatRampsService.getUserOperations().subscribe((data) => {
      this.operationsList = data;
     });
  }

  kriptonEnabled() {
    return this.providers.find((provider) => provider.alias === 'kripton');
  }

  getProviders() {
    this.providers = this.providersFactory.create().all();
  }

  goToFaqs() {
    this.navController.navigateForward('/support/faqs/buy');
  }

  handler() {
    if (this.tokenOperationDataService.tokenOperationData) {
      this.navController.navigateForward('fiat-ramps/select-provider');
    } else {
      this.navController.navigateForward('fiat-ramps/token-selection');
    }
  }
}
