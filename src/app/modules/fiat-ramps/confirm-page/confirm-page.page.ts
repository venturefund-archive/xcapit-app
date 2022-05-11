import { Component, OnInit } from '@angular/core';
import {
  OperationDataInterface,
  StorageOperationService,
} from '../shared-ramps/services/operation/storage-operation.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { NavController } from '@ionic/angular';
import { PROVIDERS } from '../shared-ramps/constants/providers';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { NETWORK_COLORS } from '../../wallets/shared-wallets/constants/network-colors.constant';

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
      <ion-text class="ux-font-text-lg ios hydrated ion-padding-top ion-margin-top">
        <div class="ion-margin-top">
          {{ 'fiat_ramps.confirm.title' | translate }}
        </div>
      </ion-text>
      <div class="cp__transfer-confirm-card">
        <app-transfer-confirm-card
          [token]="this.token"
          [operationData]="this.operationData"
          [provider]="this.provider"
        >
        </app-transfer-confirm-card>
      </div>
      <div class="cp__disclaimer ux-font-text-xxs">
        {{'fiat_ramps.confirm.disclaimer' | translate}}
      </div>
    </ion-content>

    <div class="cp__footer ux_footer">
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
  operationData: OperationDataInterface;
  provider: any = null;
  disabledButton = false;
  token: Coin;
  networkColors = NETWORK_COLORS;

  constructor(
    private storageOperationService: StorageOperationService,
    private apiWalletService: ApiWalletService,
    private fiatRampsService: FiatRampsService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storageOperationService.data.subscribe((data) => {
      this.operationData = data;
      this.token = this.apiWalletService.getCoin(this.operationData.currency_out, this.operationData.network);
      this.provider = this.getProvider(this.operationData.provider);
    });
  }

  getProvider(providerId: string) {
    return PROVIDERS.find((provider) => provider.id.toString() === providerId);
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
