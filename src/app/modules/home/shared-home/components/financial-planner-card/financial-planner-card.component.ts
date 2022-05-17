import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-financial-planner-card',
  template: `
    <div class="fpc" (click)="this.goToFinancialPlanner()" name="Go To Financial Planner">
      <div class="fpc__content">
        <div class="fpc__content__image">
          <div class="fpc__content__image__img">
            <ion-icon name="ux-flag"></ion-icon>
          </div>
        </div>
        <div class="fpc__content__body">
          <div class="fpc__content__body__title">
            <ion-text class="ux-font-text-lg">
              {{ 'home.shared.financial_planner_card.title' | translate }}
            </ion-text>
          </div>
          <div class="fpc__content__body__description">
            <ion-text class="ux-font-text-xxs">
              {{ 'home.shared.financial_planner_card.description' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="fpc__content__arrow">
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./financial-planner-card.component.scss'],
})
export class FinancialPlannerCardComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToFinancialPlanner() {
    this.navController.navigateForward('/financial-planner/information');
  }
}
