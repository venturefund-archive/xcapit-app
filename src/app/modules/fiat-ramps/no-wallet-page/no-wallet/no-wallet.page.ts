import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ReferralsHistoryComponent } from 'src/app/modules/referrals/shared-referrals/components/referrals-history/referrals-history.component';

@Component({
  selector: 'app-no-wallet',
  template: `
    <ion-content class="ion-padding" [scrollY]="false">
      <div class="main">
        <div class="main__button_content">
          <ion-button class="main__close_button" appTrackClick fill="clear" name="Close" (click)="this.close()">
            <ion-icon class="main__close_button__icon" name="ux-close" color="uxsemidark"></ion-icon>
          </ion-button>
        </div>
        <div class="main__image">
          <img src="assets/img/wallets/no-wallet.svg" />
        </div>
        <div class="main__primary_text ux-font-text-xl">
          <ion-text>{{ 'wallets.no_wallet.title' | translate }}</ion-text>
        </div>
        <div class="main__secondary_text ux-font-text-base">
          <ion-text>{{ 'wallets.no_wallet.subtitle' | translate }}</ion-text>
        </div>
        <div class="main__button">
          <div class="main__button__wallet">
            <ion-button
              appTrackClick
              color="uxsecondary"
              class="ux_button"
              name="Go To Create Wallet"
              (click)="this.goToCreateWallet()"
            >
              {{ 'wallets.no_wallet.button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./no-wallet.page.scss'],
})
export class NoWalletPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToCreateWallet() {
    this.navController.navigateForward(['tabs/wallets']);
  }

  close() {
    this.navController.navigateBack(['tabs/home']);
  }
}
