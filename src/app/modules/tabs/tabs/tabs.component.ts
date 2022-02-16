import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs #tabs (ionTabsDidChange)="this.tabChange()">
      <ion-tab-bar slot="bottom">
        <ion-tab-button
          tab="home"
          appTrackClick
          name="Tab Home"
          layout="{{ this.selectedTab === 'home' ? 'icon-start' : 'label-hide' }}"
        >
          <ion-icon src="assets/img/tabs/Home.svg"></ion-icon>
          <ion-label class="label ux-font-text-xxs">{{ 'tabs.home' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="wallets"
          appTrackClick
          name="Tab Wallet"
          (click)="this.goToWallet()"
          layout="{{ this.selectedTab === 'wallets' ? 'icon-start' : 'label-hide' }}"
        >
          <ion-icon src="assets/img/tabs/Wallet.svg"></ion-icon>
          <ion-label class="label ux-font-text-xxs">{{ 'tabs.wallet' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="investments"
          appTrackClick
          (click)="this.goToInvestments()"
          name="Tab Investments"
          class="investments"
          layout="{{ this.selectedTab === 'investments' ? 'icon-start' : 'label-hide' }}"
        >
          <ion-icon src="assets/img/tabs/Trending-up.svg"></ion-icon>
          <ion-label class="label ux-font-text-xxs">{{ 'tabs.new_fund' | translate }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  @ViewChild('tabs', { static: true }) tabs: IonTabs;
  activeTab?: HTMLElement;
  selectedTab: any;
  constructor(private navController: NavController) {}

  tabChange() {
    this.selectedTab = this.tabs.getSelected();
    this.activeTab = this.tabs.outlet.activatedView.element;
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

  goToInvestments() {
    this.navController.navigateRoot(['/tabs/investments']);
  }

  async goToWallet() {
    this.navController.navigateForward(['/tabs/wallets']);
  }
}
