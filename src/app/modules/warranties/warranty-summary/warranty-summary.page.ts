import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { SummaryWarrantyData } from '../send-warranty/interfaces/summary-warranty-data.interface';
import { isAddress } from 'ethers/lib/utils';
import { WalletPasswordWithValidatorComponent } from '../../wallets/shared-wallets/components/wallet-password-with-validator/wallet-password-with-validator.component';
import { Password } from '../../swaps/shared-swaps/models/password/password';
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
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { Lender } from 'src/app/shared/models/lender/lender.interface';
import { ActiveLenderInjectable } from 'src/app/shared/models/active-lender/injectable/active-lender.injectable';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { RawToken, TokenRepo } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { TokenByAddress } from '../../swaps/shared-swaps/models/token-by-address/token-by-address';
import { BlockchainTokens } from '../../swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { DefaultTokens } from '../../swaps/shared-swaps/models/tokens/tokens';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { Token } from '../../swaps/shared-swaps/models/token/token';

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
      <div class="ws__transaction-summary-card" *ngIf="this.warrantyData && this.tplToken">
        <app-warranty-summary-card
          [token]="this.tplToken"
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
          [disabled]="this.loading"
          [loadingText]="'warranties.summary.loading' | translate"
          class="ux_button"
          color="secondary"
          appTrackClick
          name="ux_warranty_start_confirm"
          (click)="this.handleSubmit()"
          >{{ 'warranties.summary.buttonName' | translate }}
        </ion-button>
        <ion-label *ngIf="this.loading" class="ux-loading-message ux-font-text-xxs" color="neutral80">
          {{ 'warranties.summary.wait_loading_message' | translate }}
        </ion-label>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./warranty-summary.page.scss'],
})
export class WarrantySummaryPage {
  warrantyData: SummaryWarrantyData;
  loading: boolean;
  walletAddress: string;
  transactionData: SummaryWarrantyData;
  warantyOperationId: any;
  nativeTokenBalance: number;
  tplToken: RawToken;
  private _lender: Lender;
  private _token: Token;

  constructor(
    private trackService: TrackService,
    private modalController: ModalController,
    private walletTransactionsService: WalletTransactionsService,
    private warrantyDataService: WarrantyDataService,
    private warrantyService: WarrantiesService,
    private storageService: StorageService,
    private ionicStorageService: IonicStorageService,
    private apiWalletService: ApiWalletService,
    private walletBalance: WalletBalanceService,
    private defiInvesmentService: DefiInvestmentsService,
    private remoteConfig: RemoteConfigService,
    private activeLenderInjectable: ActiveLenderInjectable,
    private blockchainsFactory: BlockchainsFactory
  ) {}

  async ionViewWillEnter() {
    await this._setLender();
    await this._setToken();
    this.trackScreenview();
    this.warrantyData = this.warrantyDataService.data;
    await this.userWalletAddress();
    this.calculateWarrantyAmounts();
    await this.setNativeTokenBalance();
  }

  private async _setLender() {
    this._lender = await this.activeLenderInjectable.create().value();
  }

  private async _setToken() {
    this._token = await new TokenByAddress(
      this.apiWalletService.getCoin(this._lender.token(), this._lender.blockchain()).contract,
      new BlockchainTokens(
        this.blockchainsFactory.create().oneByName(this._lender.blockchain()),
        new DefaultTokens(new TokenRepo(this.apiWalletService.getCoins()))
      )
    ).value();
    this.tplToken = this._token.json();
  }

  trackScreenview() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_warranty_start_confirm_screenview',
    });
  }

  isFaucetActivated() {
    return this.remoteConfig.getFeatureFlag('ff_fundFaucetOnWarranties');
  }

  async setNativeTokenBalance() {
    this.nativeTokenBalance = await this.walletBalance.balanceOf(
      this.apiWalletService.getNativeTokenFromNetwork(this._lender.blockchain())
    );
  }

  async handleSubmit(skipChecksBeforeSend: boolean = false) {
    this.loading = true;
    await this.ionicStorageService.set('user_dni', this.warrantyData.user_dni);
    if (!skipChecksBeforeSend && !(await this.checksBeforeSend())) {
      return;
    }
    try {
      const password = await this.askForPassword();
      if (!password) {
        return;
      }
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
    this.walletAddress = await this.storageService.getWalletsAddresses(this._lender.blockchain());
  }

  private _warrantyCreationDataOf(transactionReceipt: TransactionReceipt) {
    return {
      wallet: this.walletAddress,
      amount: this.warrantyData.amountWithoutCost,
      service_cost: this.warrantyData.service_cost,
      transaction_hash: transactionReceipt.transactionHash,
      user_dni: this.warrantyData.user_dni,
      lender: this.warrantyData.lender,
      currency: this.warrantyData.currency,
      blockchain: this.warrantyData.blockchain,
    };
  }

  async askForPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordWithValidatorComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      componentProps: {
        customEvent: 'ux_warranty_start_pass',
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
    }
    return true;
  }

  private async send(password: Password) {
    const response = await this.walletTransactionsService.send(
      password.value(),
      this.warrantyData.amount,
      this._lender.depositAddress(),
      this._token.json()
    );
    response.wait().then((transactionReceipt) => {
      this.warrantyService
        .createWarranty(this._warrantyCreationDataOf(transactionReceipt))
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
        eventName: 'ux_warranty_start_success_screenview',
        data: SUCCESS_TYPES.warrant_success,
      },
    });
    await modal.present();
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
  }

  async openBlockchainErrorModal() {
    await this.openErrorModal(SUCCESS_TYPES.warrant_blockchain_error);
  }

  async openGenericErrorModal() {
    await this.openErrorModal(SUCCESS_TYPES.warrant_generic_error);
  }

  private userCanAffordTx(): Promise<boolean> {
    return this.walletTransactionsService.canAffordSendTx(
      this._lender.depositAddress(),
      this.warrantyData.amount,
      this._token.json()
    );
  }

  private userCanAffordSendFee(): Promise<boolean> {
    return this.walletTransactionsService.canAffordSendFee(
      this._lender.depositAddress(),
      this.warrantyData.amount,
      this._token.json()
    );
  }

  private addressIsValid() {
    return isAddress(this._lender.depositAddress());
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
    if (this.isFaucetActivated()) {
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
