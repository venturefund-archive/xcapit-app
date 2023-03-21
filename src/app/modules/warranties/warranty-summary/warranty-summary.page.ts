import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { SummaryWarrantyData } from '../send-warranty/interfaces/summary-warranty-data.interface';
import { isAddress } from 'ethers/lib/utils';
import { WalletPasswordWithValidatorComponent } from '../../wallets/shared-wallets/components/wallet-password-with-validator/wallet-password-with-validator.component';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { environment } from 'src/environments/environment';
import { WarrantyDataService } from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';
import { WarrantiesService } from '../shared-warranties/services/warranties.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WarrantyInProgressTransactionModalComponent } from 'src/app/shared/components/warranty-in-progress-transaction-modal/warranty-in-progress-transaction-modal.component';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { SuccessContentComponent } from 'src/app/shared/components/success-content/success-content.component';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletBalanceService } from '../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { DefiInvestmentsService } from '../../defi-investments/shared-defi-investments/services/defi-investments-service/defi-investments.service';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Component({
  selector: 'app-warranty-summary',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button appTrackClick name="ux_nav_go_back" defaultHref="warranties/send-warranty"></ion-back-button>
        </ion-buttons>
        <ion-title class="ws__header">{{ 'warranties.summary.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ws ion-padding">
      <div class="ws__transaction-summary-card" *ngIf="this.warrantyData">
        <app-warranty-summary-card
          [title]="'warranties.summary.title' | translate"
          [documentTitle]="'warranties.summary.dniLabel' | translate"
          [amountTitle]="'warranties.summary.amountLabel' | translate"
          [warrantyData]="this.warrantyData"
          [serviceCost]="'warranties.summary.serviceLabel' | translate"
        ></app-warranty-summary-card>
      </div>
      <div class="ws__support">
        <app-whatsapp-support> </app-whatsapp-support>
      </div>
    </ion-content>
    <ion-footer class="ws__footer">
      <div class="ws__footer__submit-button ion-padding">
        <ion-button
          [appLoading]="this.loading"
          [loadingText]="'wallets.send.send_summary.loader' | translate"
          class="ux_button"
          color="secondary"
          appTrackClick
          name="ux_warranty_start_confirm"
          (click)="this.handleSubmit()"
          >{{ 'warranties.summary.buttonName' | translate }}</ion-button
        >
      </div>
    </ion-footer>
  `,
  styleUrls: ['./warranty-summary.page.scss'],
})
export class WarrantySummaryPage {
  warrantyData: SummaryWarrantyData;
  isSending: boolean;
  loading: boolean;
  warrantyAddress = environment.warrantyAddress;
  walletAddress: string;
  transactionData: SummaryWarrantyData;
  warantyOperationId: any;
  isFeatureFlagFaucet: boolean;
  isElegibleToFund: boolean;
  nativeTokenBalance: number;

  constructor(
    private trackService: TrackService,
    private modalController: ModalController,
    private walletTransactionsService: WalletTransactionsService,
    private warrantyDataService: WarrantyDataService,
    private warrantyService: WarrantiesService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private walletBalance: WalletBalanceService,
    private defiInvesmentService: DefiInvestmentsService,
    private remoteConfig: RemoteConfigService
  ) {}

  async ionViewWillEnter() {
    this.checkFeatureFlagFaucet();
    this.trackScreenview();
    this.warrantyData = this.warrantyDataService.data;
    await this.userWalletAddress();
    this.calculateWarrantyAmounts();
    await this.setNativeTokenBalance();
    this.setIsElegibleToFund();
  }

  trackScreenview() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_warranty_start_confirm_screenview',
    });
  }

  checkFeatureFlagFaucet() {
    this.isFeatureFlagFaucet = this.remoteConfig.getFeatureFlag('ff_fundFaucetOnWarranties');
  }

  async setNativeTokenBalance() {
    this.nativeTokenBalance = await this.walletBalance.balanceOf(
      this.apiWalletService.getNativeTokenFromNetwork(this.warrantyData.coin.network)
    );
  }

  setIsElegibleToFund() {
    this.isElegibleToFund = this.isFeatureFlagFaucet ? this.nativeTokenBalance === 0.0 : false;
  }

  async handleSubmit(skipChecksBeforeSend: boolean = false) {
    if (!skipChecksBeforeSend && !(await this.checksBeforeSend())) {
      return;
    }
    try {
      const password = await this.askForPassword();
      if (!password) {
        return;
      }
      this.loading = true;
      await this.fundWallet();
      await this.send(password);
    } catch (error) {
      this.openGenericErrorModal();
    }
  }

  calculateWarrantyAmounts() {
    const cost = this.warrantyData.amount * 0.02;
    const amountWithoutCost = this.warrantyData.amount - cost;
    this.warrantyData = Object.assign({
      ...this.warrantyData,
      service_cost: cost,
      amountWithoutCost: amountWithoutCost,
      quoteAmountWithoutCost: amountWithoutCost,
    });
  }

  async userWalletAddress() {
    this.walletAddress = await this.storageService.getWalletsAddresses(this.warrantyData.coin.network);
  }

  updateDataBeforeSend(res) {
    this.transactionData = Object.assign({
      wallet: this.walletAddress,
      currency: this.warrantyData.coin.value,
      status: 'IN',
      amount: this.warrantyData.amount,
      service_cost: this.warrantyData.service_cost,
      transaction_hash: res.transactionHash,
      user_dni: this.warrantyData.user_dni,
    });
  }

  async askForPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordWithValidatorComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      componentProps: {
        state: 'send',
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data === undefined) this.loading = false;
    return data;
  }

  private async checksBeforeSend(): Promise<boolean> {
    if (!this.addressIsValid()) {
      await this.handleInvalidAddress();
      return false;
    }

    if (await this.userCanAffordSendFee()) {
      if (!(await this.userCanAffordTx())) {
        await this.handleUserCantAffordTx();
        return false;
      }
    } else {
      if (!this.isElegibleToFund) {
        return false;
      }
    }
    return true;
  }

  private async send(password: Password) {
    const response = await this.walletTransactionsService.send(
      password.value(),
      this.warrantyData.amount,
      this.warrantyAddress,
      this.warrantyData.coin
    );
    response.wait().then((res) => {
      this.updateDataBeforeSend(res);
      this.warrantyService
        .createWarranty(this.transactionData)
        .toPromise()
        .then((res) => {
          this.warantyOperationId = res.id;
          this.openSuccessModal();
          this.loading = false;
        });
    });
  }

  async openSuccessModal() {
    const modal = await this.modalController.create({
      component: WarrantyInProgressTransactionModalComponent,
      cssClass: 'ux-lg-modal-informative',
      backdropDismiss: false,
      componentProps: {
        operationNumber: this.warantyOperationId,
      },
    });
    await modal.present();
    await modal.onDidDismiss();
    modal.dismiss();
  }

  async openErrorModal(successType) {
    const modal = await this.modalController.create({
      component: SuccessContentComponent,
      cssClass: 'ux-lg-modal-informative',
      backdropDismiss: false,
      componentProps: {
        data: successType,
        calledAsModal: true,
      },
    });
    await modal.present();
    await modal.onDidDismiss();
    modal.dismiss();
  }

  async openBlockchainErrorModal() {
    await this.openErrorModal(SUCCESS_TYPES.warrant_blockchain_error);
  }

  async openGenericErrorModal() {
    await this.openErrorModal(SUCCESS_TYPES.warrant_generic_error);
  }

  private userCanAffordTx(): Promise<boolean> {
    return this.walletTransactionsService.canAffordSendTx(
      this.warrantyAddress,
      this.warrantyData.amount,
      this.warrantyData.coin
    );
  }

  private userCanAffordSendFee(): Promise<boolean> {
    return this.walletTransactionsService.canAffordSendFee(
      this.warrantyAddress,
      this.warrantyData.amount,
      this.warrantyData.coin
    );
  }

  private addressIsValid() {
    return isAddress(this.warrantyAddress);
  }

  private async handleInvalidAddress() {
    this.openGenericErrorModal();
  }

  private async handleUserCantAffordTx() {
    await this.handleNotEnoughBalance();
  }

  private async handleNotEnoughBalance() {
    this.openBlockchainErrorModal();
  }

  async fundWallet() {
    if (this.isElegibleToFund) {
      await this.defiInvesmentService.fundWallet().toPromise();
      this.sendFundWalletEvent();
    }
  }

  sendFundWalletEvent() {
    this.trackService.trackEvent({
      eventLabel: 'ux_faucet_request',
    });
  }
}
