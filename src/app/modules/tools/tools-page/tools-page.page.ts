import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { TOOLS_CARDS } from '../shared-tools/components/tools-card/tools-card-content.constant';
import { WalletBackupService } from 'src/app/modules/wallets/shared-wallets/services/wallet-backup/wallet-backup.service';

@Component({
  selector: 'app-tool',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <div class="header">
          <app-xcapit-logo [whiteLogo]="true"></app-xcapit-logo>
        </div>
        <app-avatar-profile></app-avatar-profile>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="tp__title">
        <ion-text class="ux-font-text-xl">
        {{ 'tools.tools_page.header' | translate }}
        </ion-text>
      </div>
          <div class="tool-card">
            <app-tools-card *ngFor="let cardItem of content" [data]="cardItem" (primaryActionEvent)="itemAction($event)"></app-tools-card>
          </div>
      <div class="financial-planner-card" *ngIf="this.plannerData">
        <div class="title">
          <ion-text class="ux-font-header-titulo" color="neutral80">{{
            'home.shared.financial_planner_card.my_plan' | translate
          }}</ion-text>
        </div>
        <div class="card-objetive" (click)="this.goToPlannerInfo()">
          <app-objetive-card
            [icon]="this.icon"
            [category]="this.category"
            [necessaryAmount]="this.plannerData.necessaryAmount"
            [name]="this.plannerData.name"
            [edit]="false"
          ></app-objetive-card>
        </div>
      </div>
    </ion-content>
    `,
  styleUrls: ['./tools-page.page.scss'],
})
export class ToolsPage implements OnInit {
  plannerData: any;
  icon: string;
  category: string;
  content = TOOLS_CARDS;

  constructor(
    private navController: NavController,
    private appStorage: AppStorageService,
    private trackService: TrackService,
    private walletBackupService : WalletBackupService,
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getPlannerData();
    this.trackScreenViewEvent();
  }

  async getPlannerData() {
    this.plannerData = await this.appStorage.get('planner_data');
    this.setPlannerData();
  }

  setPlannerData() {
    if (this.plannerData) {
      this.icon = `assets/img/financial-planner/categories/${this.plannerData.category}.svg`;
      this.category = `financial_planner.shared_financial_planner.objetive_card.categories.${this.plannerData.category}`;
    }
  }

  trackScreenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_screenview_tools',
    });
  }

  async itemAction(buttonName: string) {
    switch (buttonName) {
      case 'ux_go_to_donations':
        await this.goToDonations();
        break;
      case 'ux_go_to_planner':
        this.goToPlannerInfo();
        break;
    }
  }

  private async goToDonations() {
    if ((await this.walletBackupService.presentModal()) === 'skip') {
      this.navController.navigateForward(['/donations/causes']);
    }
  }

  goToPlannerInfo() {
    this.navController.navigateForward(['/financial-planner/result-objetive']);
  }
}
