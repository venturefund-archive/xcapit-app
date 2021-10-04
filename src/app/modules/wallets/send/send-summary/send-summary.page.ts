import { Component, OnInit } from '@angular/core';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { SummaryData } from './interfaces/summary-data.interface';
import { SubmitButtonService } from '../../../../shared/services/submit-button/submit-button.service';
import { WalletTransactionsService } from '../../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { ModalController, NavController } from '@ionic/angular';
import { WalletPasswordComponent } from '../../shared-wallets/components/wallet-password/wallet-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { LocalNotificationsService } from '../../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';
import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { LocalNotification } from '@capacitor/core';
import { ToastService } from '../../../../shared/services/toast/toast.service';

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
        <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24">
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
          appTrackClick
          name="Send"
          [disabled]="this.submitButtonService.isDisabled | async"
          (click)="this.beginSend()"
          >{{ 'wallets.send.send_summary.send_button' | translate }}</ion-button
        >
      </div>
    </ion-content>`,
  styleUrls: ['./send-summary.page.scss'],
})
export class SendSummaryPage implements OnInit {
  summaryData: SummaryData;
  action: string;
  constructor(
    private transactionDataService: TransactionDataService,
    private walletTransactionsService: WalletTransactionsService,
    private modalController: ModalController,
    private navController: NavController,
    public submitButtonService: SubmitButtonService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private localNotificationsService: LocalNotificationsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async () => {
      const navParams = this.router.getCurrentNavigation().extras.state;
      if (navParams) await this.beginSend();
    });
  }

  ionViewWillEnter() {
    this.summaryData = this.transactionDataService.transactionData;
  }

  async askForPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal full-screen-modal',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data;
  }

  beginSend() {
    this.askForPassword().then((password: string) => this.send(password));
  }

  private goToSuccess(response: TransactionResponse) {
    this.navController.navigateForward(['/wallets/send/success']).then(() => this.notifyWhenTransactionMined(response));
  }

  private send(password: string) {
    this.loadingService.show().then();
    this.walletTransactionsService
      .send(password, this.summaryData.amount, this.summaryData.address, this.summaryData.currency)
      .then((response: TransactionResponse) => this.goToSuccess(response))
      .catch((error) => this.handleSendError(error))
      .finally(() => this.loadingService.dismiss());
  }

  private createNotification(transaction: TransactionReceipt): LocalNotification[] {
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
      .then((notification: LocalNotification[]) => this.localNotificationsService.send(notification));
  }

  private handleSendError(error) {
    let url: string;
    switch (error.message) {
      case 'invalid password':
        url = '/wallets/send/error/incorrect-password';
        break;
    }
    this.navController.navigateForward(url).then();
  }
}
