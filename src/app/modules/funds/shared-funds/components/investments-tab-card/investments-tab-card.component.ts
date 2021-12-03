import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-investments-tab-card',
  template: `
    <ion-card class="itc ux-card-new ion-no-margin ion-padding">
      <div class="itc__text_col">
        <div class="itc__text_col__title_ct">
          <ion-text class="itc__text_col__title_ct__title ux-font-text-lg">
            {{ this.title | translate }}
          </ion-text>
        </div>
        <div class="itc__text_col__text_ct">
          <ion-text class="itc__text_col__text_ct__text ux-font-text-xxs">
            {{ this.text | translate }}
          </ion-text>
        </div>
      </div>
      <div class="itc__button_col">
        <ion-button
          appTrackClick
          name="Navigate to Option"
          class="itc__button_col__button ion-no-padding ion-no-margin"
          fill="clear"
          size="small"
          (click)="this.navigateToOption()"
        >
          <ion-icon class="itc__button_col__button__icon" name="ux-forward"></ion-icon>
        </ion-button>
      </div>
    </ion-card>
  `,
  styleUrls: ['./investments-tab-card.component.scss'],
})
export class InvestmentsTabCardComponent implements OnInit {
  @Input() optionName: string;
  title: string;
  text: string;
  navigationRoute: string;

  constructor(private navController: NavController) {}

  ngOnInit() {
    this.title = `funds.investments_tab.${this.optionName}.title`;
    this.text = `funds.investments_tab.${this.optionName}.text`;
    this.navigationRoute = `/tabs/investments/${this.optionName}`;
  }

  navigateToOption() {}
}
