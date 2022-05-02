import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-objetive-card',
  template: `
    <div class="ux-card ion-padding">
      <div class="body">
        <div class="body__icon">
          <ion-icon [icon]="this.icon"></ion-icon>
        </div>
        <div class="body__header">
          <div class="body__header__title">
            <ion-text class="ux-font-text-lg">{{ this.data.name }}</ion-text>
          </div>
          <div class="body__header__category">
            <ion-text class="ux-font-text-xs">{{ this.formattedCategory }}</ion-text>
          </div>
        </div>
        <div class="body__edit">
          <ion-button
            appTrackClick
            name="ux_financial_planner_edit"
            class="ion-no-margin"
            fill="clear"
            size="small"
            (click)="this.goToNewObjetive()"
          >
            <ion-icon icon="edit"></ion-icon>
          </ion-button>
        </div>
      </div>
      <div class="result">
        <div class="result__objetive">
          <ion-text class="ux-font-text-base">{{ 'financial_planner.result_objetive.objetive' | translate }}</ion-text>
        </div>
        <div class="result__necessary-amount">
          <ion-text class="ux-font-text-lg">{{ this.data.necessaryAmount }}</ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./objetive-card.component.scss'],
})
export class ObjetiveCardComponent implements OnInit {
  @Input() data;
  formattedCategory: string;
  icon: string;
  constructor(private navController: NavController) {}

  ngOnInit() {
    this.formatCategory();
    this.icon = `assets/img/financial-planner/categories/${this.data.category}.svg`;
  }

  formatCategory() {
    const firstCharacter = this.data.category.charAt(0).toUpperCase();
    const restOfString = this.data.category.slice(1);
    this.formattedCategory = firstCharacter + restOfString;
  }

  goToNewObjetive() {
    this.navController.navigateForward(['financial-planner/new-objetive']);
  }
}
