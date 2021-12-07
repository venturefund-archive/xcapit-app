import { Component } from '@angular/core';
import { MenuController, NavController, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs #tabs (ionTabsDidChange)="this.tabChange(tabs)">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" appTrackClick name="Tab Home">
          <ion-icon src="assets/img/tabs/Home.svg"></ion-icon>
          <ion-label class="label ux-font-text-xs">{{ 'tabs.home' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="investments" (click)="this.goToInvestments()" appTrackClick name="Tab Investments">
          <ion-icon src="assets/img/tabs/Trending-up.svg"></ion-icon>
          <ion-label class="label ux-font-text-xs">{{ 'tabs.new_fund' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="this.goToWallet()" appTrackClick name="Tab Wallet">
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
  private activeTab?: HTMLElement;

  constructor(private menu: MenuController, private navController: NavController) {}

  tabChange(tabsRef: IonTabs) {
    this.activeTab = tabsRef.outlet.activatedView.element;
  }

  ionViewWillLeave() {
    this.propagateToActiveTab('ionViewWillLeave');
  }

  ionViewDidLeave() {
    this.propagateToActiveTab('ionViewDidLeave');
  }

  ionViewWillEnter() {
    this.propagateToActiveTab('ionViewWillEnter');
  }

  ionViewDidEnter() {
    this.propagateToActiveTab('ionViewDidEnter');
  }

  private propagateToActiveTab(eventName: string) {
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }

  showMenu() {
    this.navController.navigateForward(['/menus/main-menu']);
  }

  goToInvestments() {
    this.navController.navigateRoot(['/tabs/investments']);
  }

  async goToWallet() {
    this.navController.navigateForward(['/tabs/wallets']);
  }
}
