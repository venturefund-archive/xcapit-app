import { Component, OnInit } from '@angular/core';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { NavController } from '@ionic/angular';
import { PROVIDERS } from '../shared-ramps/constants/providers';

@Component({
  selector: 'app-confirm-page',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/moonpay"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.confirm.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding cp">
      <ion-text class="ux-font-text-xl ios hydrated ion-padding-top ion-margin-top">
        <div class="ion-margin-top">
          {{ 'fiat_ramps.confirm.title' | translate }}
        </div>
      </ion-text>

      <div class="cp__content">
        <app-ux-loading-block *ngIf="!this.operationData" minSize="30px"></app-ux-loading-block>
        <div *ngIf="this.operationData">
          <ion-text class="ux-font-text-xs cp__content__text">
            <span class="cp__content__text__title">
              {{ 'fiat_ramps.confirm.provider' | translate }}
            </span>
            <span> {{ this.provider.name }} </span>
          </ion-text>

          <ion-text class="ux-font-text-xs cp__content__text">
            <span class="cp__content__text__title"> {{ 'fiat_ramps.confirm.type' | translate }} </span>
            <span *ngIf="this.operationData.type === 'cash-in'">
              {{ 'fiat_ramps.confirm.buy.operationType' | translate }}
            </span>
            <span *ngIf="this.operationData.type === 'cash-out'">
              {{ 'fiat_ramps.confirm.sell.operationType' | translate }}
            </span>
          </ion-text>

          <ion-text class="ux-font-text-xs cp__content__text" *ngIf="this.operationData.type === 'cash-in'">
            <span class="cp__content__text__title">
              {{ 'fiat_ramps.confirm.buy.title' | translate }}
            </span>
            <span>
              {{ this.operationData.currency_out | uppercase }}
              {{ 'fiat_ramps.confirm.buy.with' | translate }}
              {{ this.operationData.currency_in | uppercase }}
            </span>
          </ion-text>

          <ion-text class="ux-font-text-xs cp__content__text" *ngIf="this.operationData.type === 'cash-out'">
            <span class="cp__content__text__title">
              {{ 'fiat_ramps.confirm.sell.title' | translate }}
            </span>
            <span>
              {{ this.operationData.currency_in | uppercase }}
              {{ 'fiat_ramps.confirm.sell.with' | translate }}
              {{ this.operationData.currency_out | uppercase }}
            </span>
          </ion-text>

          <ion-text class="ux-font-text-xs cp__content__text">
            <span class="cp__content__text__title">
              {{ 'fiat_ramps.confirm.amount' | translate }}
            </span>
            <span *ngIf="this.operationData.type === 'cash-in'"
              >{{ this.operationData.amount_in | currency }}
              <small>{{ this.operationData.currency_in }}</small>
            </span>
            <span *ngIf="this.operationData.type === 'cash-out'"
              >{{ this.operationData.amount_out | currency }}
              <small>{{ this.operationData.currency_out }}</small> }}</span
            >
          </ion-text>

          <ion-text class="ux-font-text-xs cp__content__text">
            <span class="cp__content__text__title">
              {{ 'fiat_ramps.confirm.quotation' | translate }}
            </span>
            <span *ngIf="this.operationData.currency_in === 'ARS' || this.operationData.currency_in === 'USD'">
              1 {{ this.operationData.currency_out | uppercase }} = {{ this.quotation | number: '1.2-2' }}
              {{ this.operationData.currency_in | uppercase }}
            </span>
            <span *ngIf="this.operationData.currency_in !== 'ARS' && this.operationData.currency_in !== 'USD'">
              1 {{ this.operationData.currency_in | uppercase }} = {{ this.quotation | number: '1.2-2' }}
              {{ this.operationData.currency_out | uppercase }}
            </span>
          </ion-text>

          <ion-text class="ux-font-text-xs cp__content__text">
            <span class="cp__content__text__title">
              {{ 'fiat_ramps.confirm.wallet' | translate }}
            </span>
            <span> {{ this.operationData.wallet }} </span>
          </ion-text>
        </div>
      </div>

      <div class="cp__content__advise">
        <ion-text class="ion-margin-top ion-margin-bottom">
          {{ 'fiat_ramps.confirm.disclaimer' | translate }}
        </ion-text>
      </div>
    </ion-content>

    <div class="ux_footer">
      <div class="button-next">
        <ion-button
          class="ux_button"
          appTrackClick
          name="Next"
          type="button"
          color="secondary"
          size="large"
          [disabled]="disabledButton"
          (click)="this.createOperation()"
        >
          {{ 'fiat_ramps.confirm.confirm' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./confirm-page.page.scss'],
})
export class ConfirmPagePage implements OnInit {
  operationData: any = null;
  provider: any = null;
  disabledButton = false;
  quotation = 0;

  constructor(
    private storageOperationService: StorageOperationService,
    private fiatRampsService: FiatRampsService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storageOperationService.data.subscribe((data) => {
      this.operationData = data;
      this.provider = this.getProvider(this.operationData.provider);
      this.calculateQuotation();
    });
  }

  getProvider(providerId: string) {
    return PROVIDERS.find((provider) => provider.id.toString() === providerId);
  }

  async calculateQuotation() {
    if (this.operationData.type === 'cash-in') {
      this.quotation = this.operationData.price_in;
    }
    this.quotation = this.operationData.price_out;
  }

  async createOperation() {
    this.disabledButton = true;
    this.fiatRampsService.createOperation(this.operationData).subscribe({
      next: (res) => {
        this.storageOperationService.setOperationId(res.id);
        this.navController.navigateForward(['fiat-ramps/success-page']);
      },
      complete: () => {
        this.disabledButton = false;
      },
    });
  }
}
