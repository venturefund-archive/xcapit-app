import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs #tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="funds" appTrackClick name="Tab Home">
          <ion-icon src="assets/img/tabs/Home.svg"></ion-icon>
          <ion-label class="label ux-font-text-xs">{{ 'tabs.home' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="this.goToNewFund()" appTrackClick name="Tab New Fund">
          <ion-icon src="assets/img/tabs/Trending-up.svg"></ion-icon>
          <ion-label class="label ux-font-text-xs">{{ 'tabs.new_fund' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="this.goToWallet()" tab="wallets" appTrackClick name="Tab Wallet">
          <ion-icon src="assets/img/tabs/Wallet.svg"></ion-icon>
          <ion-label class="label ux-font-text-xs">{{ 'tabs.wallet' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="showMenu()" appTrackClick name="Tab Menu">
          <ion-icon src="assets/img/tabs/Menu.svg"></ion-icon>
          <ion-label class="label ux-font-text-xs">{{ 'tabs.menu' | translate }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  private openMenu = false;
  newFundUrl: string;

  constructor(private menu: MenuController, private navController: NavController) {}

  showMenu() {
    // this.menu.toggle();
    this.navController.navigateForward('menus/main-menu');
  }

  goToNewFund() {
    this.navController.navigateRoot(this.newFundUrl);
  }

  goToWallet() {
    this.navController.navigateForward('tabs/wallets');
  }
}
