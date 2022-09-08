import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';

@Component({
  selector: 'app-buy-crypto-card',
  template: `
    <div class="bcc" (click)="this.emitClicked()" name="ux_go_to_buy_banner" appTrackClick>
      <div class="bcc__image">
        <img src="assets/img/home/btc-coins.svg" alt="BTC coins" />
      </div>
      <div class="bcc__text">
        <ion-text class="ux-font-text-lg">{{ 'home.shared.buy_crypto_card.title' | translate }}</ion-text>
      </div>
      <div class="bcc__arrow">
        <ion-icon name="ux-forward" color="white"></ion-icon>
      </div>
    </div>
  `,
  styleUrls: ['./buy-crypto-card.component.scss'],
})
export class BuyCryptoCardComponent implements OnInit {
  @Output() clicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  emitClicked() {
    this.clicked.emit();
  }
}
