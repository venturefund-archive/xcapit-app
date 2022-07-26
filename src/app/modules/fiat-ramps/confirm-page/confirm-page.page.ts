import { Component, OnInit } from '@angular/core';
import {
  OperationDataInterface,
  StorageOperationService,
} from '../shared-ramps/services/operation/storage-operation.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { NavController } from '@ionic/angular';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { NETWORK_COLORS } from '../../wallets/shared-wallets/constants/network-colors.constant';
import { WalletMaintenanceService } from '../../wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../shared-ramps/models/providers/providers.interface';

@Component({
  selector: 'app-confirm-page',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/new-operation/moonpay"></ion-back-button>
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
        <app-transfer-confirm-card [token]="this.token" [operationData]="this.operationData" [provider]="this.provider">
        </app-transfer-confirm-card>
      </div>
      <div class="cp__disclaimer ux-font-text-xxs">
        {{ 'fiat_ramps.confirm.disclaimer' | translate }}
        <br />
        {{ 'fiat_ramps.confirm.disclaimer2' | translate }}
      </div>
    </ion-content>

    <div class="cp__footer ux_footer">
      <div class="button-next">
        <ion-button
          class="ux_button"
          appTrackClick
          name="ux_buy_kripton_confirm"
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
    private navController: NavController,
    private walletMaintenance: WalletMaintenanceService,
    private providersFactory: ProvidersFactory
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
    return this.providers()
      .all()
      .find((provider) => provider.id.toString() === providerId);
  }

  providers(): Providers {
    return this.providersFactory.create();
  }

  async createOperation() {
    this.disabledButton = true;
    this.fiatRampsService.createOperation(this.operationData).subscribe({
      next: (res) => {
        this.storageOperationService.setOperationId(res.id);
        this.addBoughtCoinIfUserDoesNotHaveIt();
        this.navController.navigateForward(['fiat-ramps/success-page', res.id]);
      },
      complete: () => {
        this.disabledButton = false;
      },
    });
  }

  addBoughtCoinIfUserDoesNotHaveIt(): Promise<void> {
    return this.walletMaintenance.addCoinIfUserDoesNotHaveIt(this.token);
  }
}
