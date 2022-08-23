import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
@Component({
  selector: 'app-investor-test-cards',
  template: ` <div class="investor-cards">
    <div class="take-test-card vertical-card" name="ux_education_go" (click)="this.goToEducation()">
      <div class="take-test-card__image">
        <ion-img src="assets/ux-icons/take-test.svg"></ion-img>
      </div>
      <div class="take-test-card__title">
        <ion-text class="ux-font-titulo-xs">{{ 'home.home_page.test_investor_cards.title1' | translate }}</ion-text>
      </div>
      <div>
        <ion-button
          *ngIf="this.testAvailable"
          appTrackClick
          class="link ux-link-xl"
          name="ux_education_go"
          fill="clear"
          size="small"
        >
          {{ 'home.home_page.test_investor_cards.link1' | translate }}
          <ion-icon slot="end" color="info" name="ux-forward" class="ux-link-xl"></ion-icon>
        </ion-button>
        <ion-badge *ngIf="!this.testAvailable" class="badge ux-badge-coming ux-font-num-subtitulo">{{
          'home.home_page.test_investor_cards.badge_text' | translate
        }}</ion-badge>
      </div>
    </div>
    <div
      class="options-test-card vertical-card"
      appTrackClick
      name="Go Investor Options"
      (click)="this.goToInvestorOptions()"
    >
      <div class="options-test-card__image">
        <ion-img src="assets/ux-icons/manual-test.svg"></ion-img>
      </div>
      <div class="options-test-card__content">
        <div class="options-test-card__content__title">
          <ion-text class="ux-font-titulo-xs">{{ 'home.home_page.test_investor_cards.title2' | translate }}</ion-text>
        </div>
      </div>
      <div>
        <ion-button
          *ngIf="this.optionsTestAvailable"
          appTrackClick
          class="link ux-link-xl"
          name="Manage"
          fill="clear"
          size="small"
        >
          {{ 'home.home_page.test_investor_cards.link2' | translate }}
          <ion-icon slot="end" color="info" name="ux-forward" class="ux-link-xl"></ion-icon>
        </ion-button>
        <ion-badge *ngIf="!this.optionsTestAvailable" class="badge ux-badge-coming ux-font-num-subtitulo" slot="end">{{
          'home.home_page.test_investor_cards.badge_text' | translate
        }}</ion-badge>
      </div>
    </div>
  </div>`,
  styleUrls: ['./investor-test-cards.component.scss'],
})
export class InvestorTestCardsComponent implements OnInit {
  optionsTestAvailable = true;
  testAvailable: boolean;
  constructor(
    private navController: NavController,
    private remoteConfigService: RemoteConfigService
  ) {}

  ngOnInit() {
    this.testAvailable = this.remoteConfigService.getFeatureFlag('ff_educationCardAvailable');
  }

  goToInvestorOptions() {
    if (this.optionsTestAvailable) {
      this.navController.navigateForward(['wealth-management/investor-test-options']);
    }
  }

  async goToEducation() {
    if (this.testAvailable) this.navController.navigateForward(['tabs/financial-education']);
  }
}
