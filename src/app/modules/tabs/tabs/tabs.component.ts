import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController, IonTabs } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs #tabs (ionTabsDidChange)="this.tabChange()">
      <ion-tab-bar >
        <ion-tab-button *ngIf="!this.isNewLogin"
          tab="home"
          appTrackClick
          name="ux_nav_go_to_home"
          layout="{{ this.selectedCategory === 'home' ? 'icon-start' : 'label-hide' }}"
        >
          <ion-icon src="assets/img/tabs/Home.svg"></ion-icon>
          <ion-label class="label ux-font-text-xxs">{{ 'tabs.home' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="wallets"
          appTrackClick
          name="ux_nav_go_to_wallet"
          (click)="this.goToWallet()"
          layout="{{ this.selectedCategory === 'wallets' ? 'icon-start' : 'label-hide' }}"
        >
          <ion-icon src="assets/img/tabs/Wallet.svg"></ion-icon>
          <ion-label class="label ux-font-text-xxs">{{ 'tabs.wallet' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="investments"
          appTrackClick
          (click)="this.goToInvestments()"
          name="ux_nav_go_to_invest"
          class="investments"
          layout="{{ this.selectedCategory === 'investments' ? 'icon-start' : 'label-hide' }}"
        >
          <ion-icon src="assets/img/tabs/Trending-up.svg"></ion-icon>
          <ion-label class="label ux-font-text-xxs">{{ 'tabs.new_fund' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button *ngIf="this.isNewLogin"
          tab="tools"
          appTrackClick
          (click)="this.goToTools()"
          name="ux_nav_go_to_tools"
          layout="{{ this.selectedCategory === 'tools' ? 'icon-start' : 'label-hide' }}"
        >
          <ion-icon src="assets/img/tabs/Tools.svg"></ion-icon>
          <ion-label class="label ux-font-text-xxs">{{ 'tabs.tools' | translate }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  @ViewChild('tabs', { static: true }) tabs: IonTabs;
  activeTab?: HTMLElement;
  selectedCategory: any;
  isNewLogin: boolean;
  constructor(
    private navController: NavController,
    private remoteConfigService: RemoteConfigService) {}

  tabChange() {
    this.selectedCategory = this.tabs.getSelected();
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
    this.isNewLogin = this.remoteConfigService.getFeatureFlag('ff_newLogin');
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
    this.navController.navigateRoot(['/tabs/wallets']);
  }

  goToTools() {
    this.navController.navigateRoot(['/tabs/tools']);
  }
}
