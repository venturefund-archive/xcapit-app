import { Component, OnInit } from '@angular/core';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';

@Component({
  selector: 'app-token-selection-list',
  template: `
    <div class="tsl">
      <div class="tsl__suite-container" *ngFor="let network of this.networks">
        <ion-list class="tsl__suite-container__suite">
          <ion-item lines="full" class="tsl__suite-container__suite__title ion-no-padding ion-no-margin">
            <ion-text class="ux-font-titulo-xs ion-no-padding ion-no-margin" lines="full">
              {{ 'wallets.send.select_currency.suite' | translate: { suiteName: ((this.network | suite) | uppercase) } }}
            </ion-text>
          </ion-item>
          <div *ngFor="let coin of this.getCoinsFromNetwork(network); let last = last">
            <ion-item
              class="tsl__suite-container__suite__coin-container ion-no-padding ion-no-margin"
              [lines]="last ? 'none' : 'full'"
            >
              <div class="tsl__suite-container__suite__coin-container__coin">
                <ion-img class="tsl__suite-container__suite__coin-container__coin__img" [src]="this.coin.logoRoute"></ion-img>
                <div class="tsl__suite-container__suite__coin-container__coin__text-container">
                  <ion-text class="tsl__suite-container__suite__coin-container__coin__text-container__label ux-font-text-xs">{{ this.coin.name }}</ion-text>
                  <ion-badge
                    *ngIf="this.coin.native"
                    class="tsl__suite-container__suite__coin-container__coin__text-container__badge ux-badge-native"
                    slot="end"
                    >{{ 'wallets.select_coin.native' | translate }}</ion-badge
                  >
                </div>
                  <ion-icon class="tsl__suite-container__suite__coin-container__coin__chevron" name="chevron-forward-outline" color="info" item-right></ion-icon>
              </div>
            </ion-item>
          </div>
        </ion-list>
      </div>
    </div>
  `,
  styleUrls: ['./token-selection-list.component.scss'],
})
export class TokenSelectionListComponent implements OnInit {
  get networks(): string[] {
    return this.apiWalletService.getNetworks();
  }
  constructor(private apiWalletService: ApiWalletService) {}

  getCoinsFromNetwork(network: string) {
    return this.apiWalletService.getCoinsFromNetwork(network);
  }

  ngOnInit() {}
}
