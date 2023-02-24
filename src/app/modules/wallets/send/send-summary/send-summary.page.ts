import { Component, OnInit } from '@angular/core';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { SummaryData } from './interfaces/summary-data.interface';
import { SubmitButtonService } from '../../../../shared/services/submit-button/submit-button.service';
import { WalletTransactionsService } from '../../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { TranslateService } from '@ngx-translate/core';
import { InfoSendModalComponent } from '../../shared-wallets/components/info-send-modal/info-send-modal.component';
import { TrackService } from '../../../../shared/services/track/track.service';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { InProgressTransactionModalComponent } from 'src/app/shared/components/in-progress-transaction-modal/in-progress-transaction-modal.component';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { LocalNotification } from 'src/app/shared/models/local-notification/local-notification.interface';
import { format } from 'date-fns';
import { LocalNotificationInjectable } from 'src/app/shared/models/local-notification/injectable/local-notification.injectable';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress.interface';
import { TxInProgressService } from 'src/app/modules/swaps/shared-swaps/services/tx-in-progress/tx-in-progress.service';
import { SendTxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/send/send-tx-in-progress';
import { DefaultTxHash } from '../../shared-wallets/models/tx-hash/default/default-tx-hash';
import { NullTxHash } from '../../shared-wallets/models/tx-hash/null-tx-hash/null-tx-hash';
import { SolanaToken } from 'src/app/modules/swaps/shared-swaps/models/token/solana/solana-token';
import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { SolanaSend } from '../../shared-wallets/models/solana-send/solana-send';
import { SolanaConnectionInjectable } from '../../shared-wallets/models/solana-connection/solana-connection-injectable';
import { SolanaSendTxsOf } from '../../shared-wallets/models/solana-send-txs-of/solana-send-txs-of';
import { WalletPasswordWithValidatorComponent } from '../../shared-wallets/components/wallet-password-with-validator/wallet-password-with-validator.component';
@Component({
  selector: 'app-send-summary',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button appTrackClick name="ux_nav_go_back" (click)="back()" defaultHref=""></ion-back-button>
        </ion-buttons>
        <ion-title class="sd__header">{{ 'wallets.send.send_detail.header' | translate }}</ion-title>
        <ion-label class="ux_toolbar__step" slot="end">3 {{ 'shared.step_counter.of' | translate }} 3</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ss ion-padding">
      <div class="ss__transaction-summary-card" *ngIf="this.summaryData">
        <app-transaction-summary-card
          [title]="'wallets.send.send_summary.title' | translate"
          [addressTitle]="'wallets.send.send_summary.destination_address' | translate"
          [amountsTitle]="'wallets.send.send_summary.amounts_title' | translate"
          [summaryData]="this.summaryData"
          [amountSend]="!this.amountSend"
          [transactionFee]="!this.transactionFee"
          (phraseAmountInfoClicked)="this.showPhraseAmountInfo()"
          (phrasetransactionFeeInfoClicked)="this.showPhrasereferenceFeeInfo()"
        ></app-transaction-summary-card>
      </div>

      <div class="ss__send_button">
        <ion-button
          [appLoading]="this.loading"
          [loadingText]="'wallets.send.send_summary.loader' | translate"
          class="ux_button"
          color="secondary"
          appTrackClick
          name="ux_send_send"
          [disabled]="(this.submitButtonService.isDisabled | async) || this.isSending"
          (click)="this.handleSubmit()"
          >{{ 'wallets.send.send_summary.send_button' | translate }}</ion-button
        >
      </div>
    </ion-content>`,
  styleUrls: ['./send-summary.page.scss'],
})
export class SendSummaryPage implements OnInit {
  private txInProgress: TxInProgress;
  summaryData: SummaryData;
  action: string;
  isSending: boolean;
  loading: boolean;
  amountSend = false;
  transactionFee = false;
  isInfoModalOpen = false;
  blockchain: Blockchain;
  notification: LocalNotification;

  constructor(
    private transactionDataService: TransactionDataService,
    private walletTransactionsService: WalletTransactionsService,
    private modalController: ModalController,
    private navController: NavController,
    public submitButtonService: SubmitButtonService,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private alertController: AlertController,
    private trackService: TrackService,
    private blockchains: BlockchainsFactory,
    private walletsFactory: WalletsFactory,
    private localNotificationInjectable: LocalNotificationInjectable,
    private txInProgressService: TxInProgressService,
    private solanaConnection: SolanaConnectionInjectable
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.isSending = false;
    this.summaryData = this.transactionDataService.transactionData;
    this.blockchain = this.blockchains.create().oneByName(this.summaryData.network);
  }

  async showPhraseAmountInfo() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: InfoSendModalComponent,
        componentProps: {
          title: this.translate.instant('wallets.shared_wallets.info_send_modal.title_send_amount'),
          description: this.translate.instant('wallets.shared_wallets.info_send_modal.description'),
          buttonText: this.translate.instant('wallets.shared_wallets.info_send_modal.button_text'),
        },
        cssClass: 'modal',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }

  async showPhrasereferenceFeeInfo() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: InfoSendModalComponent,
        componentProps: {
          title: this.translate.instant('wallets.shared_wallets.info_send_modal.title_transaction_fee'),
          description: this.translate.instant('wallets.shared_wallets.info_send_modal.description'),
          buttonText: this.translate.instant('wallets.shared_wallets.info_send_modal.button_text'),
        },
        cssClass: 'modal',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
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
    if (this.blockchain.name() !== 'SOLANA') {
      const response = await this.walletTransactionsService.send(
        password.value(),
        this.summaryData.amount,
        this.summaryData.address,
        this.summaryData.currency
      );
      this.txInProgress = new SendTxInProgress(this.blockchain, new DefaultTxHash(response.hash));
      this.txInProgressService.startTx(this.txInProgress);
      this.openInProgressModal();
      this.notifyWhenTransactionMined(response);
    } else {
      this.txInProgress = new SendTxInProgress(this.blockchain, new NullTxHash());
      this.txInProgressService.startTx(this.txInProgress);

      const aWallet = await this.walletsFactory.create().oneBy(this.blockchain);
      aWallet.onNeedPass().subscribe(() => password.value());
      aWallet
        .sendTxs(
          await new SolanaSendTxsOf(
            new SolanaSend(
              this.summaryData.amount,
              new SolanaToken(this.summaryData.currency as RawToken),
              this.summaryData.address
            ),
            aWallet,
            this.blockchain,
            this.solanaConnection.create(this.blockchain)
          ).blockchainTxs()
        )
        .then(() => this.notifyWhenTransactionMined())
        .catch((error) => {
          this.createNotification('error');
          this.txInProgressService.finishTx(this.txInProgress);
          throw error;
        });
      this.openInProgressModal();
    }
  }

  async openInProgressModal() {
    const modal = await this.modalController.create({
      component: InProgressTransactionModalComponent,
      componentProps: {
        data: SUCCESS_TYPES.send_in_progress,
        address: this.summaryData.address,
        blockchain: this.blockchain,
      },
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }

  private async checksBeforeSend(): Promise<boolean> {
    if (this.blockchain.name() !== 'SOLANA') {
      if (!(await this.userCanAffordFees())) {
        await this.handleUserCantAffordFees();
        return false;
      }

      if (!(await this.userCanAffordTx())) {
        await this.handleUserCantAffordTx();
        return false;
      }
    }

    return true;
  }

  async handleSubmit(skipChecksBeforeSend: boolean = false) {
    await this.startTx();

    if (!skipChecksBeforeSend) {
      if (!(await this.checksBeforeSend())) {
        await this.endTx();
        return;
      }
    }

    try {
      const password = await this.askForPassword();
      if (!password) {
        return;
      }

      this.loading = true;

      await this.send(password);
    } catch (error) {
      await this.handleSendError(error);
    } finally {
      await this.endTx();
    }
  }

  async showAlert(header: string, message: string, buttonText: string) {
    const alert = await this.alertController.create({
      header: this.translate.instant(header),
      message: this.translate.instant(message),
      cssClass: 'ux-alert-confirm',
      buttons: [
        {
          text: this.translate.instant(buttonText),
          cssClass: 'primary-button',
        },
      ],
    });
    await alert.present();
  }

  async showAlertNotEnoughNativeToken() {
    const route = 'wallets.send.send_summary.alert_not_enough_native_token';
    await this.showAlert(`${route}.title`, `${route}.text`, `${route}.button`);
  }

  private createNotification(mode: string) {
    this.notification = this.localNotificationInjectable.create(
      this.translate.instant(`wallets.send.send_notifications.${mode}.title`),
      this.translate.instant(`wallets.send.send_notifications.${mode}.body`, {
        amount: this.summaryData.amount,
        token: this.summaryData.currency.value,
        date: format(new Date(), 'dd/MM/yyyy'),
      })
    );
  }

  private notifyWhenTransactionMined(response?: TransactionResponse) {
    const fixedTxResponse = response ? response.wait() : Promise.resolve({ to: this.summaryData.address });
    fixedTxResponse
      .then(() => this._sendSuccessNotification())
      .then(() =>
        this.trackService.trackEvent({
          eventAction: 'async_tx',
          description: window.location.href,
          eventLabel: 'ux_send_notification_success',
        })
      )
      .finally(() => this.txInProgressService.finishTx(this.txInProgress));
  }

  private _sendSuccessNotification() {
    this.createNotification('success');
    this.setActionListener();
    this.notification.send();
  }

  private setActionListener() {
    this.notification.onClick(() => {
      this.navigateToTokenDetail();
    });
  }

  back() {
    this.navController.navigateBack([
      'wallets/send/detail/blockchain',
      this.summaryData.network,
      'token',
      this.summaryData.currency.contract,
      'amount',
      this.summaryData.amount,
    ]);
  }

  private navigateToTokenDetail() {
    this.navController.navigateRoot([
      `wallets/token-detail/blockchain/${this.summaryData.network}/token/${this.summaryData.currency.contract}`,
    ]);
  }

  private async handleSendError(error) {
    if (this.isNotEnoughBalanceError(error)) {
      await this.handleNotEnoughBalance();
    } else {
      throw error;
    }
  }

  private isNotEnoughBalanceError(error) {
    return error.message.startsWith('cannot estimate gas') || error.message.startsWith('insufficient funds');
  }

  private async startTx() {
    this.isSending = true;
    await this.loadingService.show();
  }

  private async endTx() {
    this.isSending = false;
    await this.loadingService.dismiss();
  }

  private userCanAffordFees(): Promise<boolean> {
    return this.walletTransactionsService.canAffordSendFee(
      this.summaryData.address,
      this.summaryData.amount,
      this.summaryData.currency
    );
  }

  private userCanAffordTx(): Promise<boolean> {
    return this.walletTransactionsService.canAffordSendTx(
      this.summaryData.address,
      this.summaryData.amount,
      this.summaryData.currency
    );
  }

  private async handleUserCantAffordFees() {
    await this.showAlertNotEnoughNativeToken();
  }

  private async handleUserCantAffordTx() {
    await this.handleNotEnoughBalance();
  }

  private async handleNotEnoughBalance() {
    await this.navController.navigateForward(['/wallets/send/error/wrong-amount']);
  }
}
