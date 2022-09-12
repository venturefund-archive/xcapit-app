import { Component, Input, OnChanges, OnInit } from '@angular/core';
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
          <img src="assets/ux-icons/ux-wallet-circle-lightinfo.svg" />
          <div class="ux-font-text-xl wbc__content_balance__body__balance">
            {{ this.totalBalanceWallet ?? '0.00' | number: '1.2-2' | hideText: this.hideFundText }}
            USD
            <div class="ux-font-text-xxs wbc__content_balance__body__description">
              {{ 'home.home_page.want_my_wallet.description' | translate }}
            </div>
          </div>
          <app-eye class="eye"></app-eye>
        </div>
      </div>
      <div
        name="Go To Wallet"
        [ngClass]="{ walletArrow: this.walletExist }"
        class="wbc__arrow"
        [dataToTrack]="{eventLabel: this.trackClickName}"
        (click)="this.goToHomeWallet()"
        appTrackClick
      >
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </div>
    </div>
  `,
  styleUrls: ['./wallet-total-balance-card.component.scss'],
})
export class WalletTotalBalanceCardComponent implements OnInit, OnChanges {
  @Input() totalBalanceWallet?: number;
  @Input() walletExist: boolean;
  hideFundText: boolean;
  trackClickName: string;

  constructor(private navController: NavController, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.subscribeOnHideFunds();
  }

  ngOnChanges() {
    this.setTrackClickName()
  }

  subscribeOnHideFunds()  {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  hideText() {
    this.localStorageService.toggleHideFunds();
  }

  goToHomeWallet() {
    this.navController.navigateForward(['tabs/wallets']);
  }

  setTrackClickName() {
    this.trackClickName = this.walletExist ? 'ux_go_to_wallet' : 'ux_create_go_to_home_wallet'
    }
}
