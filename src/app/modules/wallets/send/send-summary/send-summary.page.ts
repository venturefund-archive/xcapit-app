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
import { isAddress } from 'ethers/lib/utils';

@Component({
  selector: 'app-send-summary',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.send.send_summary.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ss ion-padding">
      <div class="ss__title">
        <ion-text class="ux-font-text-lg">
          {{ 'wallets.send.send_summary.title' | translate }}
        </ion-text>
      </div>
      <div class="ss__transaction-summary-card" *ngIf="this.summaryData">
        <app-transaction-summary-card
          [amountsTitle]="'wallets.send.send_summary.amounts_title' | translate"
          [summaryData]="this.summaryData"
        ></app-transaction-summary-card>
      </div>

      <div class="ss__send_button">
        <ion-button  
          [appLoading]="this.loading"
          [loadingText]="'wallets.send.send_summary.loader' | translate"
          class="ux_button"
          color="uxsecondary"
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
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.isSending = false;
    this.summaryData = this.transactionDataService.transactionData;
    this.checkMode();
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
      cssClass: 'ux-routeroutlet-modal full-screen-modal',
      componentProps: {
        state: 'send'
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    return data;
  }

  private goToSuccess(response: TransactionResponse) {
    this.navController.navigateForward(['/wallets/send/success']).then(() => this.notifyWhenTransactionMined(response));
  }

  private async send(password: string) {
    const response = await this.walletTransactionsService.send(password, this.summaryData.amount, this.summaryData.address, this.summaryData.currency);
    await this.goToSuccess(response);
  }

  private async checksBeforeSend(): Promise<boolean> {
    if (!this.addressIsValid()) {
      await this.handleInvalidAddress();
      return false;
    }

    if (!(await this.userCanAffordFees())) {
      await this.handleUserCantAffordFees();
      return false;
    }

    if (!(await this.userCanAffordTx())) {
      await this.handleUserCantAffordTx();
      return false;
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
      this.loading = true
      if (!password) {
        return;
      }
      await this.send(password);
    } catch(error) {
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

  private createNotification(transaction: TransactionReceipt): LocalNotificationSchema[] {
    return [
      {
        id: 1,
        title: this.translate.instant('wallets.send.send_summary.sent_notification.title'),
        body: this.translate.instant('wallets.send.send_summary.sent_notification.body', {
          address: transaction.to,
        }),
      },
    ];
  }

  private notifyWhenTransactionMined(response: TransactionResponse) {
    response
      .wait()
      .then((transaction: TransactionReceipt) => this.createNotification(transaction))
      .then((notification: LocalNotificationSchema[]) => this.localNotificationsService.send(notification));
  }

  private async handleSendError(error) {
    if (this.isInvalidPasswordError(error)) {
      await this.handleInvalidPassword();
    } else if (this.isNotEnoughBalanceError(error)) {
      await this.handleNotEnoughBalance();
    } else {
      throw error;
    }
  }

  private isInvalidPasswordError(error) {
    return error.message === 'invalid password';
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

  private addressIsValid() {
    return isAddress(this.summaryData.address);
  }

  private async handleInvalidAddress() {
    await this.navController.navigateForward(['/wallets/send/error/wrong-address']);
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
