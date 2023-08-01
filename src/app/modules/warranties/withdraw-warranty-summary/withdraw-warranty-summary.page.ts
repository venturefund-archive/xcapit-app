import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SuccessContentComponent } from 'src/app/shared/components/success-content/success-content.component';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { WarrantyInProgressTransactionModalComponent } from 'src/app/shared/components/warranty-in-progress-transaction-modal/warranty-in-progress-transaction-modal.component';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { TICKET_CATEGORIES } from '../../tickets/shared-tickets/constants/ticket-categories';
import { ApiTicketsService } from '../../tickets/shared-tickets/services/api-tickets.service';
import { WalletPasswordWithValidatorComponent } from '../../wallets/shared-wallets/components/wallet-password-with-validator/wallet-password-with-validator.component';
import { SummaryWarrantyData } from '../send-warranty/interfaces/summary-warranty-data.interface';
import { WarrantyDataService } from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';
import { WarrantiesService } from '../shared-warranties/services/warranties.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { ActiveLenderInjectable } from 'src/app/shared/models/active-lender/injectable/active-lender.injectable';
import { Lender } from 'src/app/shared/models/lender/lender.interface';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TokenByAddress } from '../../swaps/shared-swaps/models/token-by-address/token-by-address';
import { BlockchainTokens } from '../../swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { DefaultTokens } from '../../swaps/shared-swaps/models/tokens/tokens';
import { RawToken, TokenRepo } from '../../swaps/shared-swaps/models/token-repo/token-repo';

@Component({
  selector: 'app-withdraw-warranty-summary',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'warranties.withdraw_warranty.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="wws ion-padding">
      <div class="wws__transaction-summary-card" *ngIf="this.warrantyData && this.tplToken">
        <app-warranty-summary-card
          [title]="'warranties.withdraw_warranty_summary.title' | translate"
          [documentTitle]="'warranties.withdraw_warranty_summary.dniLabel' | translate"
          [emailTitle]="'warranties.withdraw_warranty_summary.emailLabel' | translate"
          [warrantyData]="this.warrantyData"
          [token]="this.tplToken"
        ></app-warranty-summary-card>
      </div>
      <div class="wws__support">
        <app-whatsapp-support> </app-whatsapp-support>
      </div>
    </ion-content>
    <ion-footer class="ww__footer">
      <div class="wws__footer__submit-button ion-padding">
        <ion-button
          class="ux_button wws__footer__submit-button__button"
          appTrackClick
          name="ux_warranty_withdraw_confirm"
          color="secondary"
          expand="block"
          [disabled]="this.loading"
          [appLoading]="this.loading"
          [loadingText]="'warranties.withdraw_warranty_summary.loader' | translate"
          (click)="this.withdrawWarranty()"
          >{{ 'warranties.withdraw_warranty_summary.button' | translate }}</ion-button
        >
      </div>
    </ion-footer>`,
  styleUrls: ['./withdraw-warranty-summary.page.scss'],
})
export class WithdrawWarrantySummaryPage {
  warrantyData: SummaryWarrantyData;
  loading: boolean;
  disable: boolean;
  tplToken: RawToken;
  private _lender: Lender;

  constructor(
    private warrantyDataService: WarrantyDataService,
    private modalController: ModalController,
    private translate: TranslateService,
    private apiTicketsService: ApiTicketsService,
    private trackService: TrackService,
    private warrantyService: WarrantiesService,
    private ionicStorageService: IonicStorageService,
    private activeLenderInjectable: ActiveLenderInjectable,
    private blockchainsFactory: BlockchainsFactory,
    private apiWalletService: ApiWalletService
  ) {}

  async ionViewWillEnter() {
    await this._setLender();
    this.screenViewEvent();
    this.warrantyData = this.warrantyDataService.data;
    await this._setToken();
  }

  private async _setLender() {
    this._lender = await this.activeLenderInjectable.create().value();
  }

  private async _setToken() {
    this.tplToken = (
      await new TokenByAddress(
        this.apiWalletService.getCoin(this._lender.token(), this._lender.blockchain()).contract,
        new BlockchainTokens(
          this.blockchainsFactory.create().oneByName(this._lender.blockchain()),
          new DefaultTokens(new TokenRepo(this.apiWalletService.getCoins()))
        )
      ).value()
    ).json();
  }

  async withdrawWarranty() {
    await this.ionicStorageService.set('user_dni', this.warrantyData.user_dni);
    const password = await this.askForPassword();
    if (!password) {
      return;
    }
    this.loading = true;
    await this.createWithdraw();
  }

  async askForPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordWithValidatorComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      componentProps: {
        state: 'withdraw_warranty',
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data === undefined) this.loading = false;
    return data;
  }

  async createWithdraw() {
    const withdrawData = {
      user_dni: this.warrantyData.user_dni,
      wallet: this.warrantyData.wallet,
      amount: this.warrantyData.amount,
      currency: this._lender.token(),
      lender: this.warrantyData.lender,
    };
    await this.warrantyService
      .withdrawWarranty(withdrawData)
      .toPromise()
      .then(({ id }) => {
        this.sendTicket(id);
      });
  }

  sendTicket(operationNumber) {
    const category = TICKET_CATEGORIES.find((category) => category.name === 'Garantía');
    const data = {
      email: this.warrantyData.email,
      category_code: category.name,
      subject: this.translate.instant(category.value),
      message: this.translate.instant('warranties.withdraw_warranty_summary.ticket_message', {
        dni: this.warrantyData.user_dni,
        wallet: this.warrantyData.wallet,
      }),
    };
    this.apiTicketsService.createTicket(data).subscribe(
      () => {
        this.goToSuccessModal(operationNumber);
        this.loading = false;
      },
      () => {
        this.goToErrorModal();
        this.loading = false;
      }
    );
  }

  async goToSuccessModal(operationNumber) {
    const modal = await this.modalController.create({
      component: WarrantyInProgressTransactionModalComponent,
      cssClass: 'ux-lg-modal-informative',
      backdropDismiss: false,
      componentProps: {
        data: SUCCESS_TYPES.withdraw_warranty_success,
        operationNumber,
        eventName: 'ux_warranty_withdraw_success_screenview',
      },
    });
    await modal.present();
    await modal.onDidDismiss();
    modal.dismiss();
  }

  async goToErrorModal() {
    const modal = await this.modalController.create({
      component: SuccessContentComponent,
      cssClass: 'ux-lg-modal-informative',
      backdropDismiss: false,
      componentProps: {
        data: SUCCESS_TYPES.wawithdraw_warranty_error,
        calledAsModal: true,
      },
    });
    await modal.present();
    await modal.onDidDismiss();
    modal.dismiss();
  }

  screenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_warranty_withdraw_confirm_screenview',
    });
  }
}
