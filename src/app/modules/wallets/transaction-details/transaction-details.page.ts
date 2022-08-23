import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NETWORK_COLORS } from '../shared-wallets/constants/network-colors.constant';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { CovalentTransfer } from '../shared-wallets/models/covalent-transfer/covalent-transfer';
import { TransactionDetailsService } from '../shared-wallets/services/transaction-details/transaction-details.service';

@Component({
  selector: 'app-transaction-details',
  template: ` <ion-header>
    <ion-toolbar color="primary" class="ux_toolbar">
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/wallets/home"></ion-back-button>
      </ion-buttons>
      <ion-title class="ion-text-center">{{ 'wallets.asset_detail.header' | translate }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="td ion-padding">
    <div class="td__card">
      <div class="td__card__title">
      <ion-text class="ux-font-text-xl">Envío</ion-text>
      </div>
      <div class="td__card__title_and_image" *ngIf="this.currency">
            <div class="td__card__title_and_image__image_container">
              <img [src]="this.currency.logoRoute" alt="Product Image" />
            </div>
            <div class="td__card__title_container">
              <div class="td__card__title_container__title">
                <ion-text class="ux-font-text-lg">{{ this.currency.value }}</ion-text>
                <ion-text class="ux-font-text-xs title">{{ this.currency.name | splitString: ' - '[1] }}</ion-text>
              </div>
              <div class="td__card__title_container__badge">
                <ion-badge [color]="this.networkColors[this.currency.network]" class="ux-badge ux-font-num-subtitulo">{{
                  this.currency.network | formattedNetwork | uppercase
                }}</ion-badge>
              </div>
            </div>
          </div>
      
    </div>
  </ion-content>`,
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {
  currency: Coin;
  networkColors = NETWORK_COLORS;
  transactionData: CovalentTransfer;
  constructor( private transactionDetailsService: TransactionDetailsService) {}

  ngOnInit() {
  }

  
  ionViewWillEnter() {
    this.transactionData = this.transactionDetailsService.transactionData;
    console.log(this.transactionData);
  }

}
