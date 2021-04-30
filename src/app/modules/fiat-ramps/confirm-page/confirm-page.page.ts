import { Component, OnInit } from '@angular/core';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-page',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/operations-new"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'fiat_ramps.confirm.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding cp">
      <div class="cp__logo">
        <img src="../../assets/img/logo_kripton.png" alt="Logo kripton" />
      </div>
      <app-ux-title class="ion-padding-top ion-margin-top">
        <div class="ion-margin-top">
          {{ 'fiat_ramps.confirm.title' | translate }}
        </div>
      </app-ux-title>

      <div class="cp__content">
        <app-ux-text>
          <div>
            <span class="cp__content__title">{{ 'fiat_ramps.confirm.operation' | translate }}</span>
            {{ this.operationData.currency_in }} -> {{ this.operationData.currency_out }}
          </div>
        </app-ux-text>

        <app-ux-text>
          <div>
            <span class="cp__content__title">{{ 'fiat_ramps.confirm.amount' | translate }}</span>
            {{ this.operationData.amount_in }} {{ this.operationData.currency_in }}
          </div>
        </app-ux-text>

        <app-ux-text>
          <div>
            <span class="cp__content__title">{{ 'fiat_ramps.confirm.quotation' | translate }}</span>
            <span *ngIf="this.operationData.type === 'cash-in'">
              1 {{ this.operationData.currency_out }} = {{ this.operationData.price_out }}
              {{ this.operationData.currency_in }}
            </span>
            <span *ngIf="this.operationData.type === 'cash-out'">
              1 {{ this.operationData.currency_in }} = {{ this.operationData.price_in }}
              {{ this.operationData.currency_out }}
            </span>
          </div>
        </app-ux-text>

        <app-ux-text>
          <div>
            <span class="cp__content__title">{{ 'fiat_ramps.confirm.wallet_address' | translate }}</span>
            {{ this.operationData.wallet }}
          </div>
        </app-ux-text>
      </div>

      <div class="cp__content__advise">
        <app-ux-text class="ion-padding-top ion-margin-top">
          <div class="ion-margin-top ion-margin-bottom">
            {{ 'fiat_ramps.confirm.disclaimer' | translate }}
          </div>
        </app-ux-text>
      </div>
    </ion-content>

    <div class="ux_footer">
      <div class="button-next">
        <ion-button
          class="ux_button"
          appTrackClick
          name="Next"
          type="button"
          color="uxsecondary"
          size="large"
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
  operationData: any;

  constructor(
    private storageOperationService: StorageOperationService,
    private fiatRampsService: FiatRampsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.storageOperationService.data.subscribe((data) => (this.operationData = data));
  }

  async createOperation() {
    this.fiatRampsService.createOperation(this.operationData).subscribe({
      next: (res) => {
        this.navController.navigateForward(['fiat-ramps/success-page']);
      },
    });
  }
}
