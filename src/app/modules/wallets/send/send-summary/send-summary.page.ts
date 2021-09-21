import { Component, OnInit } from '@angular/core';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { SummaryData } from './interfaces/summary-data.interface';
import { SubmitButtonService } from '../../../../shared/services/submit-button/submit-button.service';
import { WalletTransactionsService } from '../../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { ModalController, NavController } from '@ionic/angular';
import { WalletPasswordComponent } from '../../shared-wallets/components/wallet-password/wallet-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

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
          (click)="this.send()"
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
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async () => {
      const navParams = this.router.getCurrentNavigation().extras.state;
      if (navParams) await this.send();
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

  async send() {
    const password = await this.askForPassword();

    if (!!password) {
      await this.loadingService.show();
      try {
        await this.walletTransactionsService.send(
          password,
          this.summaryData.amount,
          this.summaryData.address,
          this.summaryData.currency
        );
        await this.navController.navigateForward(['/wallets/send/success']);
      } catch (error) {
        if (error.message === 'invalid password') {
          this.navController.navigateForward('/wallets/send/error/incorrect-password');
        }
      } finally {
        await this.loadingService.dismiss();
      }
    }
  }
}
