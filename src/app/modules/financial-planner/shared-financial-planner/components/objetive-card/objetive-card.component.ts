import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-objetive-card',
  template: `
    <div class="oc ux-card">
      <div class="oc__body">
        <div class="oc__body__icon">
          <ion-icon [icon]="this.icon"></ion-icon>
        </div>
        <div class="oc__body__header">
          <div class="oc__body__header__title">
            <ion-text class="ux-font-text-lg">{{ this.name }}</ion-text>
          </div>
          <div class="oc__body__header__category">
            <ion-text class="ux-font-text-xs">{{ this.category | translate }}</ion-text>
          </div>
        </div>
        <div class="oc__body__edit" *ngIf="this.edit">
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
      <div class="oc__result">
        <div class="oc__result__objetive">
          <ion-text class="ux-font-text-xxs">{{
            'financial_planner.shared_financial_planner.objetive_card.objetive' | translate
          }}</ion-text>
        </div>
        <div class="oc__result__necessary-amount">
          <ion-text class="ux-font-text-lg">{{ this.necessaryAmount }} USD</ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./objetive-card.component.scss'],
})
export class ObjetiveCardComponent implements OnInit {
  @Input() icon: string;
  @Input() name: string;
  @Input() category: string;
  @Input() necessaryAmount: number;
  @Input() edit = true;

  constructor(private navController: NavController) {}

  ngOnInit() {
  }

  goToNewObjetive() {
    this.navController.navigateForward(['financial-planner/new-objetive']);
  }
}
