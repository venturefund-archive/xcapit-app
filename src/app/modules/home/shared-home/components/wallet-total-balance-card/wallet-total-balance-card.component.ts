import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-wallet-total-balance-card',
  template: `
    <div class="wbc">
      <div class="wbc__content" *ngIf="!this.walletExist">
        <div class="wbc__content__body">
          <div class="ux-font-text-lg wbc__content__body__title">
            {{ 'home.home_page.want_my_wallet.title' | translate }}
          </div>
          <div class="ux-font-text-xxs wbc__content__body__subtitle">
            {{ 'home.home_page.want_my_wallet.subtitle' | translate }}
          </div>
        </div>
        <img src="/assets/img/wallets/Coins.svg" />
      </div>
      <div class="wbc__content_balance" *ngIf="this.walletExist">
        <div class="wbc__content_balance__body">
          <img src="assets/ux-icons/ux-wallet-circle.svg" />
          <div class="ux-font-text-xl wbc__content_balance__body__balance">
            {{
              (this.totalBalanceWallet ? this.totalBalanceWallet : '0.00')
                | number: '1.2-2'
                | hideText: this.hideFundText
            }}
            USD
            <div class="ux-font-text-xxs wbc__content_balance__body__description">
              {{ 'home.home_page.want_my_wallet.description' | translate }}
            </div>
          </div>
          <a class="wbc__content_balance__body__eye-button" (click)="this.hideText()">
            <ion-icon class="eye-button" [hidden]="!this.hideFundText" name="eye-off-outline"></ion-icon>
            <ion-icon class="eye-button" [hidden]="this.hideFundText" name="eye-outline"></ion-icon>
          </a>
        </div>
      </div>
      <div class="wbc__arrow" name="Go To Home Wallet" (click)="this.goToHomeWallet()" appTrackClick>
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </div>
    </div>
  `,
  styleUrls: ['./wallet-total-balance-card.component.scss'],
})
export class WalletTotalBalanceCardComponent implements OnInit {
  @Input() totalBalanceWallet?: number;
  @Input() walletExist: boolean;
  hideFundText: boolean;

  constructor(private navController: NavController, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.subscribeOnHideFunds();
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  hideText() {
    this.localStorageService.toggleHideFunds();
  }

  goToHomeWallet() {
    this.navController.navigateForward(['tabs/wallets']);
  }
}
