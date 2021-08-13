import { Component, OnInit } from '@angular/core';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';

@Component({
  selector: 'app-home-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar"> </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="wt__subheader__value">
        <div class="wt__title ux-font-lato ux-fweight-regular ux-fsize-16">
          <ion-text>
            {{ 'wallets.home.available_money' | translate }}
          </ion-text>
        </div>
        <div class="wt__amount ux-font-gilroy ux-fweight-extrabold ux-fsize-40">
          <ion-text>
            {{ this.totalBalanceWallet | number: '1.2-6' }}
            {{ this.currency }}
          </ion-text>
        </div>
      </div>
      <div class="wt__subheader">
        <app-wallets-subheader [walletExist]="this.walletExist"></app-wallets-subheader>
      </div>
    </ion-content>`,
  styleUrls: ['./home-wallet.page.scss'],
})
export class HomeWalletPage implements OnInit {
  walletExist = false;
  transactions: Array<any>;
  assets: Array<any>;
  totalBalanceWallet = 0;
  currency = 'USD';

  constructor(private walletEncryptionService: WalletEncryptionService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.encryptedWalletExist();
  }

  encryptedWalletExist() {
    this.walletEncryptionService.encryptedWalletExist().then((res) => (this.walletExist = res));
  }
}
