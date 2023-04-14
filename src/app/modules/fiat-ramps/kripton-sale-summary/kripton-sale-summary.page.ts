import { Component, OnInit } from '@angular/core';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { DefaultToken, Token } from '../../swaps/shared-swaps/models/token/token';
import { BankAccount } from '../shared-ramps/types/bank-account.type';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { WalletPasswordWithValidatorComponent } from '../../wallets/shared-wallets/components/wallet-password-with-validator/wallet-password-with-validator.component';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { TxInProgressService } from '../../swaps/shared-swaps/services/tx-in-progress/tx-in-progress.service';
import { SendTxInProgress } from '../../users/shared-users/models/tx-in-progress/send/send-tx-in-progress';
import { DefaultTxHash } from '../../wallets/shared-wallets/models/tx-hash/default/default-tx-hash';
import { TxInProgress } from '../../users/shared-users/models/tx-in-progress/tx-in-progress.interface';
import { Blockchain } from '../../swaps/shared-swaps/models/blockchain/blockchain';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';
import { RawToken } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { BuyOrDepositTokenToastComponent } from '../shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-kripton-sale-summary',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/purchases"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.kripton_sale_summary.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding kss">
      <div class="kss__card-container" *ngIf="this.data">
        <ion-card class="kss__card-container__card ux-card-new ion-no-margin no-border">
          <div class="kss__card-container__card__title">
            <ion-text class="ux-font-text-xl">
              {{ 'fiat_ramps.kripton_sale_summary.title' | translate }}
            </ion-text>
          </div>
          <div class="kss__card-container__card__coin-content">
            <app-coin-content-item *ngIf="this.country"
              [flagRoute]="this.country.flagRoute"
              [fiatCurrency]="this.data.currency_out"
              [network]="this.data.network"
              [amount]="this.data.amount_out"
              [quoteAmount]="this.data.amount_in"
              [token]="this.data.currency_in"
            ></app-coin-content-item>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__quote">
            <div class="kss__card-container__card__quote__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.quote' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__quote__description">
              <ion-text class="ux-font-text-base"> 1 {{this.data.currency_in}} = {{this.data.price_out | formattedAmount: 10:2}} {{this.data.currency_out | uppercase}}</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__transaction-fee">
            <div class="kss__card-container__card__transaction-fee__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.transaction_fee' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__transaction-fee__description">
              <ion-text class="ux-font-text-base">{{this.data.fee | formattedAmount}} {{this.nativeToken.network}}</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__provider-fee">
            <div class="kss__card-container__card__provider-fee__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.provider_fee' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__provider-fee__description">
              <ion-text class="ux-font-text-base">{{this.data.providerFee | formattedAmount}} {{this.data.currency_in}}</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__wallet">
            <div class="kss__card-container__card__wallet__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.wallet' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__wallet__description">
              <ion-text class="ux-font-text-base">1GR75NstyyLrtuR...NN89Ug5QkK87c2</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__bank-account">
            <div class="kss__card-container__card__bank-account__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.bank_account' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__bank-account__description" *ngIf="this.userBank">
              <ion-text class="ux-font-text-base">{{this.userBank.account_number}}</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__provider">
            <div class="kss__card-container__card__provider__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.provider' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__provider__description">
              <img src="assets/img/provider-logos/KriptonMarket.svg" />
              <ion-text class="ux-font-text-base">Kripton Market</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__date">
            <div class="kss__card-container__card__date__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.date' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__date__description">
            <div class="kss__card-container__card__date__description__date">
              <ion-text class="ux-font-text-base">{{ this.data.created_at | date : 'dd/MM/YYYY' }}</ion-text>
            </div>
            <div class="kss__card-container__card__date__description__hour">
              <ion-text class="ux-font-text-base">{{ this.data.created_at | date : 'HH:mm'
                    }}{{ 'fiat_ramps.kripton_operation_detail.hours' | translate }}</ion-text>
            </div>
            </div>
          </div>
        </ion-card>
      </div>
    </ion-content>
    <ion-footer class="kss__footer">
      <div class="kss__footer__submit-button ion-padding">
        <ion-button
          class="ux_button"
          color="secondary"
          appTrackClick
          name="ux_sell_send_confirm"
          (click)="this.handleSubmit()"
          
          >{{ 'fiat_ramps.kripton_sale_summary.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./kripton-sale-summary.page.scss'],
})
export class KriptonSaleSummaryPage {
  nativeToken: Token;
  walletToSend = '0xd148c6735e1777be439519b32a1a6ef9c8853934';
  userBank: BankAccount;
  data: OperationDataInterface;
  country: FiatRampProviderCountry;
  isSending: boolean;
  coin: Coin;
  loading: boolean;
  txInProgress:TxInProgress;
  blockchain: Blockchain;
  openingModal: boolean;
  modalHref: string;
  constructor(private storageOperationService: StorageOperationService,
    private fiatRampsService: FiatRampsService,
    private kriptonStorage: KriptonStorageService,
    private blockchains: BlockchainsFactory,
    private loadingService: LoadingService,
    private walletTransactionsService: WalletTransactionsService,
    private apiWalletService: ApiWalletService,
    private modalController: ModalController,
    private txInProgressService: TxInProgressService,) { }

  async ionViewWillEnter() {
    this.modalHref = window.location.href;
    this.getKriptonSaleOperation();
    this.getNativeToken();
    this.getCountry();
    this.setToken();
    await this.getUserBank();
  }

  async getUserBank() {
    const auth_token = await this.kriptonStorage.get('access_token');
    const email = await this.kriptonStorage.get('email');
    const payment_method_id = this.data.payment_method_id;
    this.userBank = await this.fiatRampsService.getUserBank({ email, auth_token, payment_method_id }).toPromise();
  }

  getKriptonSaleOperation() {
    this.data = this.storageOperationService.getData();
  }

  getNativeToken() {
    this.blockchain = this.blockchains.create().oneByName(this.data.network);
    this.nativeToken = this.blockchain.nativeToken().json();
  }

  getCountry() {
    this.country = COUNTRIES.find(
      (country) => country.name === this.data.country
    );
  }

  async handleSubmit() {
    console.log('inicio operacion')
    await this.startTx();


    if (!(await this.checksBeforeSend())) {
      await this.endTx();
      return;
    }

    console.log('chequeo ok')

    try {
      const password = await this.askForPassword();
      if (!password) {
        return;
      }

      this.loading = true;
      console.log('tengo password')
      await this.send(password);
    } catch (error) {
      //ver que hacer
     throw error
    } finally {
      await this.endTx();
    }
  }

  private async startTx() {
    this.isSending = true;
    await this.loadingService.show();
  }

  private async endTx() {
    this.isSending = false;
    await this.loadingService.dismiss();
  }

  private async checksBeforeSend(): Promise<boolean> {
    
    if (!(await this.userCanAffordFees())) {
      await this.showInsufficientBalanceFeeModal();
      return false;
    }

    if (!(await this.userCanAffordTx())) {
      await this.showInsufficientBalanceModal();
      return false;
    }
  

  return true;
}

private userCanAffordFees(): Promise<boolean> {
  console.log('coin',this.coin)
  return this.walletTransactionsService.canAffordSendFee(
    //this.data.wallet,
    this.walletToSend,
    this.data.amount_in,
    this.coin
  );
}

private userCanAffordTx(): Promise<boolean> {
  return this.walletTransactionsService.canAffordSendTx(
    //this.data.wallet,
    this.walletToSend,
    this.data.amount_in,
    this.coin
  );
}

setToken() {
  this.coin = this.apiWalletService
    .getCoins()
    .find((coin: Coin) => coin.value === this.data.currency_in && coin.network === this.data.network);
}

async showInsufficientBalanceFeeModal() {
  const text = 'swaps.home.balance_modal.insufficient_balance_fee.text';
  const primaryButtonText = 'swaps.home.balance_modal.insufficient_balance_fee.firstButtonName';
  const secondaryButtonText = 'swaps.home.balance_modal.insufficient_balance_fee.secondaryButtonName';
  await this.openModalBalance(this.nativeToken, text, primaryButtonText, secondaryButtonText);
}

async showInsufficientBalanceModal() {
  const text = 'swaps.home.balance_modal.insufficient_balance.text';
  const primaryButtonText = 'swaps.home.balance_modal.insufficient_balance.firstButtonName';
  const secondaryButtonText = 'swaps.home.balance_modal.insufficient_balance.secondaryButtonName';
  await this.openModalBalance(new DefaultToken(this.coin as RawToken), text, primaryButtonText, secondaryButtonText);
}

async openModalBalance(token: Token, text: string, primaryButtonText: string, secondaryButtonText: string) {
  if (!this.openingModal) {
    this.openingModal = true;
    const modal = await this.modalController.create({
      component: BuyOrDepositTokenToastComponent,
      cssClass: 'ux-toast-warning',
      showBackdrop: false,
      id: 'feeModal',
      componentProps: { token, text, primaryButtonText, secondaryButtonText },
    });
    if (window.location.href === this.modalHref) {
      await modal.present();
    }
    await modal.onDidDismiss().then(() => (this.openingModal = false));
  }
}


async askForPassword(): Promise<Password> {
  await this.loadingService.dismiss();
  const modal = await this.modalController.create({
    component: WalletPasswordWithValidatorComponent,
    cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
    componentProps: {
      state: 'send',
    },
  });
  await modal.present();
  const { data } = await modal.onDidDismiss();

  if (data === undefined) {
    this.loading = false;
  }

  return data;
}

private async send(password: Password) {
  const response = await this.walletTransactionsService.send(
    password.value(),
    this.data.amount_in,
    this.walletToSend,
    //this.data.wallet,
    this.coin
  );
  console.log('response', response)
  this.txInProgress = new SendTxInProgress(this.blockchain, new DefaultTxHash(response.hash));
  this.txInProgressService.startTx(this.txInProgress);
  //this.openInProgressModal();
  this.confirmOperationWhenTransactionMined(response);
}

private confirmOperationWhenTransactionMined(response:TransactionResponse) {
  response.wait()
    .then(async (result:TransactionReceipt) => await this.confirmOperation(result.blockHash))
    .finally(() => {
      console.log('termine operacion')
      this.txInProgressService.finishTx(this.txInProgress)});
}

private async successTransaction() {
  
}

private async failedTransaction() {

}

async openInProgressModal() {
/*   const modal = await this.modalController.create({
    component: InProgressTransactionModalComponent,
    componentProps: {
      data: SUCCESS_TYPES.send_in_progress,
      address: this.summaryData.address,
      blockchain: this.blockchain,
    },
    cssClass: 'modal',
    backdropDismiss: false,
  });
  await modal.present(); */
}

  async confirmOperation(tx_hash:string) {
    console.log('tx_hash',tx_hash)
    const email = await this.kriptonStorage.get('email');
    const auth_token = await this.kriptonStorage.get('access_token');
    await this.fiatRampsService.confirmCashOutOperation(this.data.operation_id, {email, auth_token, tx_hash}).toPromise();
  }
}
