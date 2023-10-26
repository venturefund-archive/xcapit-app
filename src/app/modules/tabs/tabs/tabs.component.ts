import { Component, ViewChild } from '@angular/core';
import { NavController, IonTabs } from '@ionic/angular';
import { PreviousRouteService } from '../../../shared/services/previous-route/previous-route.service';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs #tabs (ionTabsDidChange)="this.tabChange()">
      <ion-tab-bar>
        <ion-tab-button
          *appFeatureFlag="'ff_newLogin'; negated: true"
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
          *appFeatureFlag="'ff_newLogin'"
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

  constructor(private navController: NavController, private previousRouteService: PreviousRouteService) {}

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

  private _previousUrlIsNotATab() {
    return !this.previousRouteService.getPreviousUrl().startsWith('/tabs');
  }

  private propagateToActiveTab(eventName: string) {
    if (this.activeTab && this._previousUrlIsNotATab()) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }

  tabChange() {
    this.selectedCategory = this.tabs.getSelected();
    this.activeTab = this.tabs.outlet.activatedView.element;
  }

  async goToWallet() {
    this.navController.navigateRoot(['/tabs/wallets']);
  }

  goToTools() {
    this.navController.navigateRoot(['/tabs/tools']);
  }
}
