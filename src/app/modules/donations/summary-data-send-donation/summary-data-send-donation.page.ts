import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { SummaryData } from '../../wallets/send/send-summary/interfaces/summary-data.interface';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { SendDonationDataService } from '../shared-donations/services/send-donation-data.service';
import { isAddress } from 'ethers/lib/utils';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';
import { LocalNotificationsService } from '../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { WalletPasswordComponent } from '../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { LocalNotificationSchema } from '@capacitor/local-notifications';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';

@Component({
  selector: 'app-summary-data-send-donation',
  template: ` 
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded ux_toolbar__left no-border">
        <ion-buttons slot="start">
          <ion-button (click)="this.navigateBack()" name="ux_donations_back" class="sdsd__button_back"> <ion-icon name="chevron-back-outline"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'donations.send_donations.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs ux_toolbar__step" slot="end"
          >3 {{ 'shared.step_counter.of' | translate }} 3</ion-label
        >
      </ion-toolbar>
    </ion-header>

    <ion-content class="sdsd ion-padding">
      <div class="sdsd__transaction-summary-card" *ngIf="this.summaryData">
        <app-transaction-summary-card
          [title]="'donations.send_donations.summary.title' | translate"
          [addressTitle]="'donations.send_donations.summary.destination_address' | translate"
          [amountsTitle]="'donations.send_donations.summary.amount_title' | translate"
          [summaryData]="this.summaryData"
        ></app-transaction-summary-card>
      </div>
      <div class="sdsd__send_button">
        <ion-button
          [appLoading]="this.loading"
          [loadingText]="'donations.send_donations.summary.loading' | translate"
          class="ux_button"
          color="secondary"
          appTrackClick
          expand="block"
          name="ux_donations_send"
          [disabled]="this.isSending"
          (click)="this.handleSubmit()"
          >{{ 'donations.send_donations.summary.button' | translate }}</ion-button
        >
      </div>
    </ion-content>`,
  styleUrls: ['./summary-data-send-donation.page.scss'],
})
export class SummaryDataSendDonationPage implements OnInit {
  summaryData: SummaryData;
  loading: boolean;
  isSending: boolean;
  cause: string;
  constructor(
    private sendDonationData: SendDonationDataService,
    private walletTransactionsService: WalletTransactionsService,
    private modalController: ModalController,
    private navController: NavController,
    public submitButtonService: SubmitButtonService,
    private loadingService: LoadingService,
    private localNotificationsService: LocalNotificationsService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.isSending = false;
    this.summaryData = this.sendDonationData.data;
  }

  navigateBack() {
    this.navController.navigateBack(['/donations/send-donation/cause/', this.summaryData.cause, 'value', this.summaryData.currency.value, 'network', this.summaryData.network]);
  }

  private goToSuccess(response: TransactionResponse) {
    this.navController.navigateForward(['/donations/success']).then(() => this.notifyWhenTransactionMined(response));
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

  private async startTx() {
    this.isSending = true;
    await this.loadingService.show();
  }

  private async endTx() {
    this.isSending = false;
    this.loading = false;
    await this.loadingService.dismiss();
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
    if (data === undefined) this.loading = false;

    return data;
  }

  private async send(password: string) {
    const response = await this.walletTransactionsService.send(
      password,
      this.summaryData.amount,
      this.summaryData.address,
      this.summaryData.currency
    );
    await this.goToSuccess(response);
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

  async showAlertNotEnoughNativeToken() {
    const route = 'wallets.send.send_summary.alert_not_enough_native_token';
    await this.showAlert(`${route}.title`, `${route}.text`, `${route}.button`);
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

  private notifyWhenTransactionMined(response: TransactionResponse) {
    response
      .wait()
      .then((transaction: TransactionReceipt) => this.createNotification(transaction))
      .then((notification: LocalNotificationSchema[]) => this.localNotificationsService.send(notification));
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

  private addressIsValid() {
    return isAddress(this.summaryData.address);
  }

  private async handleInvalidAddress() {
    await this.navController.navigateForward(['/donations/error']);
  }

  private async handleUserCantAffordFees() {
    await this.showAlertNotEnoughNativeToken();
  }

  private async handleUserCantAffordTx() {
    await this.handleNotEnoughBalance();
  }

  private async handleInvalidPassword() {
    await this.navController.navigateForward('/donations/invalid-password');
  }

  private async handleNotEnoughBalance() {
    await this.navController.navigateForward(['/donations/error']);
  }
}
