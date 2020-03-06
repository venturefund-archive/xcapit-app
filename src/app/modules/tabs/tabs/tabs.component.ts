import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs #tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="funds" appTrackClick name="Tab Home">
          <ion-icon name="ux-bag-outline"></ion-icon>
          <ion-label>{{ 'tabs.home' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="refer" appTrackClick name="Tab Refer">
          <ion-icon name="ux-bookmark"></ion-icon>
          <ion-label>{{ 'tabs.refer' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          (click)="this.goToNewFund()"
          appTrackClick
          name="Tab New Fund"
        >
          <ion-icon name="ux-more"></ion-icon>
          <ion-label>{{ 'tabs.new_fund' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          (click)="this.showMenu()"
          tab="menu"
          appTrackClick
          name="Tab Menu"
        >
          <ion-icon name="ux-menu"></ion-icon>
          <ion-label>{{ 'tabs.menu' | translate }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  constructor(
    private menu: MenuController,
    private navController: NavController
  ) {}

  showMenu() {
    this.menu.toggle();
  }

  goToNewFund() {
    this.navController.navigateForward('apikeys/tutorial');
  }
}
