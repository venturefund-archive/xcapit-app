import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet-balance-card',
  template: `
    <div class="wbc">
      <div class="wbc__content">
        <div class="wbc__content__body">
          <div class="ux-font-text-lg wbc__content__body__title">{{ '¡Quiero mi Wallet!' }}</div>
          <div class="ux-font-text-xxs wbc__content__body__subtitle">
            {{ 'Crea tu wallet y comienza a tener el control de tus finanzas.' }}
          </div>
        </div>
        <img src="/assets/img/wallets/Coins.svg" />
        <div class="wbc__arrow">
          <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./wallet-balance-card.component.scss'],
})
export class WalletBalanceCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
