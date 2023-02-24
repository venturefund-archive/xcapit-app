import { Component, OnInit } from '@angular/core';
import { NETWORK_COLORS } from '../shared-wallets/constants/network-colors.constant';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { TransactionDetailsService } from '../shared-wallets/services/transaction-details/transaction-details.service';
import { format, parseISO } from 'date-fns';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { ScanUrlOf } from '../shared-wallets/models/scan-url-of/scan-url-of';
import { Transfer } from '../shared-wallets/models/transfer/transfer.interface';
import { JSONTransfer } from '../shared-wallets/models/json-transfer/json-transfer';
import { InfoSendModalComponent } from '../shared-wallets/components/info-send-modal/info-send-modal.component';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
@Component({
  selector: 'app-transaction-details',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.transaction_details.header' | translate }}</ion-title>
        <ion-buttons *ngIf="this.tplTransfer && this.tplTransfer.type === 'OUT'" class="back-button" slot="end">
          <app-share-transaction-detail
            [txAmount]="this.tplTransfer.amount"
            [txAsset]="this.tplTransfer.token.value"
            [txLink]="this.url"
          ></app-share-transaction-detail>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="td ion-padding">
      <div class="td__card" *ngIf="this.tplTransfer?.token">
        <div class="td__card__title">
          <ion-text class="ux-font-text-xl">{{
            'wallets.transaction_details.' + this.tplTransfer.type | translate
          }}</ion-text>
        </div>
        <div class="td__card__container">
          <div class="td__card__container__title_and_image">
            <div class="td__card__container__title_and_image__image_container">
              <img [src]="this.tplTransfer.token.logoRoute" alt="Product Image" />
            </div>
            <div class="td__card__container__title_container">
              <div class="td__card__container__title_container__title">
                <ion-text class="ux-font-text-lg">{{ this.tplTransfer.token.value }}</ion-text>
              </div>
              <div class="td__card__container__title_container__badge">
                <ion-badge
                  [color]="this.networkColors[this.tplTransfer.token.network]"
                  class="ux-badge ux-font-num-subtitulo"
                  >{{ this.tplTransfer.token.network | formattedNetwork | uppercase }}</ion-badge
                >
              </div>
            </div>
          </div>
          <div class="td__card__container__amount">
            <div>
              <ion-text class="ux-font-text-lg"
                >{{ this.tplTransfer.amount | formattedAmount }}
                {{ this.tplTransfer.token.value | titlecase | uppercase }}</ion-text
              >
            </div>
            <div class="td__card__container__amount__conversion">
              <ion-text class="ux-font-text-xs">
                = {{ this.tplTransfer.quoteAmount | formattedAmount: 10:2 }} USD
              </ion-text>
            </div>
          </div>
        </div>
        <div class="td__card__item">
          <div class="divider list-divider"></div>
          <div class="td__card__item__title">
            <ion-text class="ux-font-title-xs">{{ 'wallets.transaction_details.title_status' | translate }} </ion-text>
            <ion-icon
              appTrackClick
              [dataToTrack]="{ eventLabel: 'transaction_detail' }"
              name="information-circle"
              (click)="this.showOperatingStatusInformation()"
              color="info"
            ></ion-icon>
          </div>
          <div class="container-item">
            <div class="td__card__item__badge">
              <ion-badge
                class="ux-font-num-subtitulo"
                [ngClass]="{ confirmed: this.tplTransfer.successful, declined: !this.tplTransfer.successful }"
              >
                {{
                  (this.tplTransfer.successful ? 'wallets.transactions.confirmed' : 'wallets.transactions.declined')
                    | translate
                }}</ion-badge
              >
            </div>
            <div class="td__card__item__link">
              <ion-text (click)="this.openTransactionUrl()" class="ux-link-xs" name="scan_link">{{
                'wallets.transaction_details.link' | translate
              }}</ion-text>
            </div>
          </div>
          <div class="divider list-divider"></div>
          <div class="td__card__item__title">
            <ion-text class="ux-font-title-xs">{{
              (this.isReception ? 'wallets.transaction_details.from_wallet' : 'wallets.transaction_details.to_wallet')
                | translate
            }}</ion-text>
          </div>
          <div class="td__card__item__wallet">
            <ion-text *ngIf="!this.contact" class="ux-font-text-base">{{
              this.isReception ? this.tplTransfer.from_address : this.tplTransfer.to_address
            }}</ion-text>
            <app-contact-item
              *ngIf="this.contact"
              [name]="this.contact.name"
              [address]="this.contact.address"
              [networks]="[this.tplTransfer.token.network]"
              [showWalletImg]="false"
              [boldName]="false"
            ></app-contact-item>
          </div>
          <ng-container *ngIf="">
            <div class="divider list-divider"></div>
            <div class="td__card__item__title">
              <ion-text class="ux-font-title-xs">{{ 'wallets.transaction_details.title_fee' | translate }}</ion-text>
            </div>
            <div class="container-item">
              <div class="td__card__item__fee">
                <ion-text class="ux-font-text-base">{{ this.tplTransfer.fee }}</ion-text>
              </div>
              <div class="td__card__item__usd">
                <ion-text class="ux-font-text-base"
                  >{{ this.tplTransfer.gas_quote | formattedAmount: 10:2 }} USD</ion-text
                >
              </div>
            </div>
          </ng-container>
          <div class="divider list-divider"></div>
          <div class="td__card__item__title">
            <ion-text class="ux-font-title-xs">{{ 'wallets.transaction_details.title_date' | translate }}</ion-text>
          </div>
          <div class="container-item">
            <div class="td__card__item__date">
              <ion-text class="ux-font-text-base">{{ this.formattedDate }}</ion-text>
            </div>
            <div class="td__card__item__time">
              <ion-text class="ux-font-text-base">{{ this.formattedTime }} H</ion-text>
            </div>
          </div>
        </div>
      </div>
      <div class="td__support">
        <div class="td__support__text">
          <ion-text class="ux-font-text-base">{{ 'shared.need_help.text_help_link' | translate }}</ion-text>
        </div>
        <div class="td__support__link">
          <ion-text class="link ux-link-xs" (click)="this.goToSupport()" name="support_link">
            {{ 'shared.need_help.text_help_support' | translate }}</ion-text
          >
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {
  currency: Coin;
  networkColors = NETWORK_COLORS;
  transactionData: Transfer;
  formattedDate: string;
  formattedTime: string;
  tplTransfer: any;
  url: string;
  contact: any;
  isReception: boolean;

  constructor(
    private transactionDetailsService: TransactionDetailsService,
    private browserService: BrowserService,
    private modalController: ModalController,
    private translate: TranslateService,
    private navController: NavController,
    private ionicService: IonicStorageService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.getTransactionData();
    this.getTransactionUrl();
    this.setTransactionDateAndTime();
    this.isReception = this.tplTransfer.type === 'IN';
    await this._getContacts();
  }

  private async _getContacts() {
    const contacts = await this.ionicService.get('contact_list');
    const addresses = contacts.map((c) => c.address);
    const index = addresses.findIndex(
      (a: string) => a === (this.isReception ? this.tplTransfer.from_address : this.tplTransfer.to_address)
    );
    if (index !== -1) {
      this.contact = contacts[index];
    }
  }

  setTransactionDateAndTime() {
    const dateAndTime = format(parseISO(this.tplTransfer.block_signed_at), 'dd-MM-yyyy HH:mm').split(' ');
    this.formattedDate = dateAndTime[0];
    this.formattedTime = dateAndTime[1];
  }
  getTransactionUrl() {
    this.url = ScanUrlOf.create(this.tplTransfer.tx_hash, this.tplTransfer.token.network).value();
  }

  private getTransactionData() {
    this.tplTransfer = new JSONTransfer(this.transactionDetailsService.transactionData).value();
  }

  openTransactionUrl() {
    this.browserService.open({
      url: this.url,
    });
  }

  async showOperatingStatusInformation() {
    const modal = await this.modalController.create({
      component: InfoSendModalComponent,
      componentProps: {
        title: this.translate.instant('wallets.transaction_details.modal_info_state.title'),
        description: this.translate.instant(
          this.tplTransfer.successful
            ? 'wallets.transaction_details.modal_info_state.description_confirmed'
            : 'wallets.transaction_details.modal_info_state.description_refused'
        ),
        buttonText: this.translate.instant('wallets.transaction_details.modal_info_state.button_text'),
        state: this.tplTransfer.successful,
      },
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }

  goToSupport() {
    this.navController.navigateForward(['/tickets/create-support-ticket']);
  }
}
