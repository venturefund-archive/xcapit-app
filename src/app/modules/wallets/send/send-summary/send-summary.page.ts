import { Component, OnInit } from '@angular/core';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { SummaryData } from './interfaces/summary-data.interface';
import { SubmitButtonService } from '../../../../shared/services/submit-button/submit-button.service';
import { WalletTransactionsService } from '../../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { WalletPasswordComponent } from '../../shared-wallets/components/wallet-password/wallet-password.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { LocalNotificationsService } from '../../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';
import { TranslateService } from '@ngx-translate/core';
import { LocalNotificationSchema } from '@capacitor/local-notifications';
import { InfoSendModalComponent } from '../../shared-wallets/components/info-send-modal/info-send-modal.component';
import { PasswordErrorMsgs } from 'src/app/modules/swaps/shared-swaps/models/password/password-error-msgs';
import { TrackService } from '../../../../shared/services/track/track.service';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { SolanaNativeSendTx } from 'src/app/modules/wallets/shared-wallets/models/'
@Component({
  selector: 'app-send-summary',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button appTrackClick name="ux_nav_go_back" defaultHref=""></ion-back-button>
        </ion-buttons>
        <ion-title class="sd__header ion-text-left">{{ 'wallets.send.send_detail.header' | translate }}</ion-title>
        <ion-label class="step-counter" slot="end">3 {{ 'shared.step_counter.of' | translate }} 3</ion-label>
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
  summaryData: SummaryData;
  action: string;
  isSending: boolean;
  loading: boolean;
  amountSend = false;
  transactionFee = false;
  isInfoModalOpen = false;
  blockchain: Blockchain;

  constructor(
    private transactionDataService: TransactionDataService,
    private walletTransactionsService: WalletTransactionsService,
    private modalController: ModalController,
    private navController: NavController,
    public submitButtonService: SubmitButtonService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private localNotificationsService: LocalNotificationsService,
    private translate: TranslateService,
    private alertController: AlertController,
    private trackService: TrackService,
    private blockchains: BlockchainsFactory,
    private walletsFactory: WalletsFactory
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.isSending = false;
    this.summaryData = this.transactionDataService.transactionData;
    console.log('summary data')
    console.log(this.summaryData)
    this.blockchain = this.blockchains.create().oneByName(this.summaryData.network);
    this.checkMode();
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

  checkMode() {
    const mode = this.route.snapshot.paramMap.get('mode') === 'retry';
    if (mode) {
      this.handleSubmit(true).then();
    }
  }

  async askForPassword() {
    await this.loadingService.dismiss();
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
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

  private goToSuccess(response?: TransactionResponse) {
    this.navController.navigateForward(['/wallets/send/success']).then(() => this.notifyWhenTransactionMined(response));
  }

  private async send(password: string) {
    if (this.blockchain.name() !== 'SOLANA') {
      const response = await this.walletTransactionsService.send(
        password,
        this.summaryData.amount,
        this.summaryData.address,
        this.summaryData.currency
      );
      await this.goToSuccess(response);
    } else {
      const wallet = await this.walletsFactory.create().oneBy(this.blockchain);
      wallet.onNeedPass().subscribe(() => new Password(password).value());
      await wallet.sendTxs([new SolanaNativeSendTx(wallet, this.summaryData.address, this.summaryData.amount)]);
      await this.goToSuccess();
    }
  }

  private async checksBeforeSend(): Promise<boolean> {
    console.log('blockchainnnnn')
    console.log(this.blockchain)
    console.log(this.blockchain.name())
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

  private createNotification(address: string): LocalNotificationSchema[] {
    return [
      {
        id: 1,
        title: this.translate.instant('wallets.send.send_summary.sent_notification.title'),
        body: this.translate.instant('wallets.send.send_summary.sent_notification.body', {
          address,
        }),
      },
    ];
  }

  private notifyWhenTransactionMined(response: TransactionResponse) {
    const fixedTxResponse = response ? response.wait() : Promise.resolve({ to: this.summaryData.address });
    fixedTxResponse
      .then((transaction: TransactionReceipt) => this.createNotification(transaction.to))
      .then((notification: LocalNotificationSchema[]) => this.localNotificationsService.send(notification))
      .then(() =>
        this.trackService.trackEvent({
          eventAction: 'async_tx',
          description: window.location.href,
          eventLabel: 'ux_send_notification_success',
        })
      );
  }

  private async handleSendError(error) {
    if (new PasswordErrorMsgs().isInvalidError(error)) {
      await this.handleInvalidPassword();
    } else if (this.isNotEnoughBalanceError(error)) {
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

  private async handleInvalidPassword() {
    await this.navController.navigateForward(['/wallets/send/error/incorrect-password']);
  }

  private async handleNotEnoughBalance() {
    await this.navController.navigateForward(['/wallets/send/error/wrong-amount']);
  }
}
