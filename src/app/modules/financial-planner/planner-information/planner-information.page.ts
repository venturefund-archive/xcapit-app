import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-planner-information',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-title class="ion-text-center">{{ 'financial_planner.planner_information.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ux_main">
        <div class="fpi__content ux_content">
          <div class="fpi__content__img ">
            <img src="assets/img/financial-planner/goal.svg" />
          </div>
          <div class="fpi__content__title">
            <ion-text class="ux-font-text-xl">
              {{ 'financial_planner.planner_information.title' | translate }}
            </ion-text>
          </div>
          <div class="fpi__content__items ">
            <div class="fpi__content__items__item">
              <img src="assets/img/financial-planner/item_1.svg" />
              <ion-text class="ux-font-text-base">
                {{ 'financial_planner.planner_information.item_1' | translate }}
              </ion-text>
            </div>
            <div class="fpi__content__items__item">
              <img src="assets/img/financial-planner/item_2.svg" />
              <ion-text class="ux-font-text-base">
                {{ 'financial_planner.planner_information.item_2' | translate }}
              </ion-text>
            </div>
            <div class="fpi__content__items__item">
              <img src="assets/img/financial-planner/item_3.svg" />
              <ion-text class="ux-font-text-base">
                {{ 'financial_planner.planner_information.item_3' | translate }}
              </ion-text>
            </div>
          </div>
        </div>
        <div class="ux_footer">
          <div class="fpi__button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="go_to_planner"
              type="submit"
              color="secondary"
              size="large"
              (click)="this.navigateToFinancialPlanner()"
            >
              {{ 'deposit_addresses.deposit_currency.next_button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./planner-information.page.scss'],
})
export class PlannerInformationPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  navigateToFinancialPlanner() {
    this.navController.navigateForward('');
  }
}
