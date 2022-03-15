import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-error-investment',
  template:`
  <ion-content class="ion-padding">
      <div class="main">
        <div class="main__button_content">
          <ion-button class="main__close_button" appTrackClick fill="clear" name="Close" (click)="this.close()">
            <ion-icon class="main__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
          </ion-button>
        </div>
        <div class="main__image">
          <img src="assets/img/defi-investments/error-investment.svg" />
        </div>
        <div class="main__primary_text ux-font-text-xl">
          <ion-text>{{ 'defi_investments.error_investment.title' | translate }}</ion-text>
        </div>
        <div class="main__secondary_text ux-font-text-base">
          <ion-text>{{ 'defi_investments.error_investment.subtitle' | translate }}</ion-text>
        </div>
        <div class="main__buttons">
          <ion-button
            appTrackClick
            color="secondary"
            class="ux_button"
            expand="block"
            name="Try Again"
            (click)="this.tryAgain()"
          >
            {{ 'defi_investments.error_investment.primaryButton' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
    `,
  styleUrls: ['./error-investment.page.scss'],
})
export class ErrorInvestmentPage implements OnInit {

  constructor(private navController: NavController) {}

  ngOnInit() {}

  close(){
    this.navController.navigateBack(['tabs/home']);
  }

  tryAgain(){
    this.navController.navigateRoot(['tabs/investments/defi']);
  }

}
