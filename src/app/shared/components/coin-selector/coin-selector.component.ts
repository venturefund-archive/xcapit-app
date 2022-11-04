import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Coin } from '../../../modules/wallets/shared-wallets/interfaces/coin.interface';

@Component({
  selector: 'app-coin-selector',
  template: `
    <div appTrackClick name="Coin Selector Component" class="cs" (click)="this.emitEventChangeCurrency()">
      <div class="cs__label">
        <ion-label class="ux-font-titulo-xs">{{ 'wallets.receive.currency_select' | translate }}</ion-label>
      </div>
      <div class="cs__selector">
        <ion-item class="cs__selector__item  ion-no-padding ion-no-margin" lines="none">
          <div class="cs__selector__item__logo">
            <img [src]="this.selectedCoin.logoRoute" alt="logo" />
          </div>
          <ion-label class="ion-no-margin" [ngClass]="{ 'label_matic': this.selectedCoin.value === 'MATIC' }" color="neutral90">{{
            this.selectedCoin.value
          }}</ion-label>
          <ion-icon
            *ngIf="this.enabled"
            class="cs__selector__item__chevron"
            color="info"
            [name]="this.isRightOpen ? 'chevron-forward-outline' : 'chevron-down-outline'"
          ></ion-icon>
        </ion-item>
      </div>
    </div>
  `,
  styleUrls: ['./coin-selector.component.scss'],
})
export class CoinSelectorComponent {
  @Input() selectedCoin: Coin;
  @Input() enabled: boolean;
  @Input() isRightOpen = false;
  @Output() changeCurrency: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  emitEventChangeCurrency() {
    if (this.enabled) {
      this.changeCurrency.emit();
    }
  }
}
