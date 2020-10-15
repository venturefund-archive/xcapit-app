import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { MainMenuPageModule } from '../../menus/main-menu/main-menu.module';
import { ApiReferralsService } from 'src/app/modules/referrals/shared-referrals/services/api-referrals/api-referrals.service';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs #tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="funds" appTrackClick name="Tab Home">
          <ion-icon name="ux-bag-outline"></ion-icon>
          <ion-label>{{ 'tabs.home' | translate }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          (click)="this.checkReferrals()"
          appTrackClick
          name="Tab Refer"
        >
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

        <ion-tab-button (click)="showMenu()" appTrackClick name="Tab Menu">
          <ion-icon name="ux-menu"></ion-icon>
          <ion-label>{{ 'tabs.menu' | translate }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  private openMenu: boolean = false;
  newFundUrl: string;
  constructor(
    private menu: MenuController,
    private navController: NavController,
    private apiReferral: ApiReferralsService
  ) {}

  showMenu() {
    //this.menu.toggle();
    this.navController.navigateForward('menus/main-menu');
  }

  goToNewFund() {
    this.navController.navigateForward(this.newFundUrl);
  }

  checkReferrals() {
    this.apiReferral.getUserReferralsCount().subscribe(
      (data) => {
        if (data.referrals_count > 0) {
          this.navController.navigateForward('referrals/list');
        } else {
          this.navController.navigateForward('tabs/refer');
        }
      },
      () => {
        this.navController.navigateForward('tabs/refer');
      }
    );
  }
}
