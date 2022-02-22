import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PROD_COINS } from '../../constants/coins.prod';
import { Coin } from '../../interfaces/coin.interface';

@Component({
  selector: 'app-coin-selector',
  template: `
    <div class="cs" (click)="this.emitEventChangeCurrency()">
      <div class="cs__label">
        <ion-label class="ux-font-titulo-xs">{{ 'wallets.receive.currency_select' | translate }}</ion-label>
      </div>
      <div class="cs__selector">
        <ion-item class="cs__selector__item ion-no-padding ion-no-margin" lines="none">
          <div class="cs__selector__item__logo">
            <img [src]="this.selectedCoin.logoRoute" alt="logo" />
          </div>
          <ion-label class="cs__selector__item__label ion-no-margin" color="uxdark">{{ this.selectedCoin.value }}</ion-label>
          <ion-icon class="cs__selector__item__chevron" color="info" name="chevron-forward-outline"></ion-icon>
        </ion-item>
      </div>
    </div>
  `,
  styleUrls: ['./coin-selector.component.scss'],
})
export class CoinSelectorComponent implements OnInit {
  @Input() selectedCoin: Coin = PROD_COINS[1];
  @Output() changeCurrency: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  emitEventChangeCurrency() {
    this.changeCurrency.emit();
  }
}
