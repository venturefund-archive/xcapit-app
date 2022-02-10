import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-investments-tab-card',
  template: `
   <ion-card
      class="itc ux-card-new ion-no-margin ion-padding" 
      appTrackClick
      name="Navigate to Option"
      (click)="this.navigateToOption()"
    >
      <div class="itc__text_col">
        <div class="itc__text_col__title_ct">
          <ion-text class="itc__text_col__title ux-font-text-lg" [ngClass]="{itc__text_col__title: !this.disabledCard , 'itc__text_col__title_off': this.disabledCard}">
            {{ this.title | translate }}
          </ion-text>
        </div>
        <div class="itc__text_col__text_ct">
          <ion-text class="itc__text_col__text_ct__text ux-font-text-xxs"[ngClass]="{itc__text_col__text: !this.disabledCard , 'itc__text_col__text_off': this.disabledCard}">>
            {{ this.text | translate }}
          </ion-text>
        </div>
      </div>
      <div class="itc__button_col">
        <ion-button class="itc__button_col__button ion-no-padding ion-no-margin" fill="clear" size="small" *ngIf="!this.disabledCard">
          <ion-icon class="itc__button_col__button__icon" color="info" name="ux-forward"></ion-icon>
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
  disabledCard: boolean;

  constructor(private navController: NavController) {}

  ngOnInit() {
    this.title = `funds.investments_tab.${this.optionName}.title`;
    this.text = `funds.investments_tab.${this.optionName}.text`;
    this.navigationRoute = `/tabs/investments/${this.optionName}`;
    this.checkOptionName();
  }
 
  navigateToOption() {
    if(!this.disabledCard){
        this.navController.navigateRoot([this.navigationRoute]);
     }
  }

  
  checkOptionName(){
    if(this.optionName === "binance"){
     this.disabledCard = true;
    }else{
    this.disabledCard = false
    }
  }
}
