import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';

@Component({
  selector: 'app-wallet-connect-card',
  template: ` <div class="wcc" (click)="this.goToWalletConnect()" name="Go To WalletConnect">
    <div class="wcc__content">
      <div class="wcc__content__body">
        <div class="ux-font-text-lg wcc__content__body__title">
          {{ 'home.home_page.wallet_connect_card.title' | translate }}
        </div>
        <div class="ux-font-text-xxs wcc__content__body__subtitle">
          {{ 'home.home_page.wallet_connect_card.subtitle' | translate }}
        </div>
      </div>
      <div class="wcc__content__img">
        <img src="/assets/img/home/wallet-connect-card.svg" />
      </div>
    </div>
  </div>`,
  styleUrls: ['./wallet-connect-card.component.scss'],
})
export class WalletConnectCardComponent implements OnInit {
  constructor(
    private navController: NavController,
    private walletService: WalletService,
    private walletConnectService: WalletConnectService
  ) {}

  ngOnInit() {}

  async goToWalletConnect() {
    if (!(await this.walletService.walletExist())) {
      this.navController.navigateForward(['tabs/wallets']);
    } else {
      if (!this.walletConnectService.connected) {
        this.navController.navigateForward(['wallets/wallet-connect/new-connection']);
      } else {
        this.navController.navigateForward(['wallets/wallet-connect/connection-detail']);
      }
    }
  }
}
