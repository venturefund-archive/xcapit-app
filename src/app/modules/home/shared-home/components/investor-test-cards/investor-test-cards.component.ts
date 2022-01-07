import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-investor-test-cards',
  template: ` <div class="investor-cards">
    <div class="take-test-card vertical-card" name="Go Investor Test" (click)="this.goToInvestorTest()">
      <div class="take-test-card__image">
        <ion-img src="assets/ux-icons/take-test.svg"></ion-img>
      </div>
      <div class="take-test-card__title">
        <ion-text class="ux-font-titulo-xs">{{ 'home.home_page.test_investor_cards.title1' | translate }}</ion-text>
      </div>
      <div class="link">
        <ion-button *ngIf="this.testAvailable" appTrackClick class="ux-link-xl" name="Manage" fill="clear" size="small">
          {{ 'home.home_page.test_investor_cards.link1' | translate }}
          <ion-icon slot="end" color="info" name="ux-forward" class=" ux-link-xl"></ion-icon>
        </ion-button>
        <ion-badge *ngIf="!this.testAvailable" class="badge ux_badge_coming ux-font-num-subtitulo">{{
          'home.home_page.test_investor_cards.badge_text' | translate
        }}</ion-badge>
      </div>
    </div>
    <div
      class="manual-test-card vertical-card"
      appTrackClick
      name="Go Investor Profiles"
      (click)="this.goToInvestorProfiles()"
    >
      <div class="manual-test-card__image">
        <ion-img src="assets/ux-icons/manual-test.svg"></ion-img>
      </div>
      <div class="manual-test-card__content">
        <div class="manual-test-card__content__title">
          <ion-text class="ux-font-titulo-xs">{{ 'home.home_page.test_investor_cards.title2' | translate }}</ion-text>
        </div>
      </div>
      <div>
        <ion-button *ngIf="this.manualTestAvailable" appTrackClick class="link ux-link-xl" name="Manage" fill="clear" size="small">
          {{ 'home.home_page.test_investor_cards.link2' | translate }}
          <ion-icon slot="end" color="info" name="ux-forward" class=" ux-link-xl"></ion-icon>
        </ion-button>
        <ion-badge *ngIf="!this.manualTestAvailable" class="badge ux_badge_coming ux-font-num-subtitulo" slot="end">{{
          'home.home_page.test_investor_cards.badge_text' | translate
        }}</ion-badge>
      </div>
    </div>
  </div>`,
  styleUrls: ['./investor-test-cards.component.scss'],
})
export class InvestorTestCardsComponent implements OnInit {
  manualTestAvailable = false;
  testAvailable=true;
  constructor(private navController: NavController) {}
  ngOnInit() {}

  goToInvestorTest() {
    if (this.testAvailable) {
      this.navController.navigateForward(['wealth-management/investor-test-options']);
    }
  }

  goToInvestorProfiles() {
    if (this.manualTestAvailable) {
      this.navController.navigateForward(['wealth-management/about-investor-profiles']);
    }
  }
}
