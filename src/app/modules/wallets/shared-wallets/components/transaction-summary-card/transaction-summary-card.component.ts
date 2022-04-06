import { Component, Input, OnInit } from '@angular/core';
import { symbolName } from 'typescript';
import { SummaryData } from '../../../send/send-summary/interfaces/summary-data.interface';
import { NETWORK_COLORS } from '../../constants/network-colors.constant';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { TransactionDataService } from '../../services/transaction-data/transaction-data.service';

@Component({
  selector: 'app-transaction-summary-card',
  template: `
    <div class="tsc ion-padding ux-card">
      <div class="tsc__title">
        <ion-text class="ux-font-text-lg">
          {{ 'wallets.send.send_summary.title' | translate }}
        </ion-text>
      </div>
      <div class="tsc__name-and-icon">
        <div class="tsc__name-and-icon__name">
          <ion-text class="ux-font-text-base">{{ this.summaryData.currency.name }}</ion-text>
          <div class="tsc__name-and-icon__badge">
            <ion-badge [color]="this.networkColors[this.summaryData.network]" class="ux-badge ux-font-num-subtitulo">{{
              this.summaryData.network | formattedNetwork | uppercase
            }}</ion-badge>
          </div>
        </div>
        <div class="tsc__name-and-icon__icon">
          <img [src]="this.summaryData.currency.logoRoute" alt="Crypto icon" />
        </div>
      </div>
      <div class="tsc__amount">
        <div class="tsc__amount__title">
          <ion-text class="ux-font-titulo-xs">{{ this.amountsTitle }}</ion-text>
        </div>
        <div class="tsc__amount__content">
          <ion-text class="ux-font-text-base"
            >{{ this.summaryData.amount }} {{ this.summaryData.currency.value }}</ion-text
          >
          <ion-text class="ux-font-text-base">{{ this.summaryData.referenceAmount }} USD</ion-text>
        </div>
      </div>
      <div class="tsc__address">
        <div class="tsc__address__title">
          <ion-text class="ux-font-titulo-xs">{{ this.addressTitle }}</ion-text>
        </div>
        <div class="tsc__address__content">
          <ion-text class="ux-font-text-base">{{ this.summaryData.address }}</ion-text>
        </div>
      </div>
      <div class="tsc__fee">
        <div class="tsc__fee__title">
          <ion-text class="ux-font-titulo-xs">
            {{ 'wallets.send.send_summary.fee' | translate }}
          </ion-text>
        </div>
        <div class="tsc__fee__fee">
          <ion-text class="saic__fee__fee__amount ux-font-text-base"
            >{{ this.summaryData.fee | number: '1.5-5' }} {{ this.nativeToken.value }}</ion-text
          >
          <ion-text class="saic__fee__fee__reference_amount ux-font-text-base"
            >{{ this.summaryData.referenceFee | number: '1.2-2' }} USD</ion-text
          >
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./transaction-summary-card.component.scss'],
})
export class TransactionSummaryCardComponent implements OnInit {
  @Input() summaryData: SummaryData;
  @Input() amountsTitle: string;
  @Input() addressTitle: string;
  networkColors = NETWORK_COLORS;
  nativeToken: Coin;

  constructor(private apiWalletService: ApiWalletService) {}

  ngOnInit() {
    this.getNativeToken();
  }

  private getNativeToken() {
    this.nativeToken = this.apiWalletService.getNativeTokenFromNetwork(this.summaryData.network);
  }
}
