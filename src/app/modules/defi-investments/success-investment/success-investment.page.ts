import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-investment',
  template: `
    <ion-content class="ion-padding">
      <div class="main">
        <div class="main__button_content">
          <ion-button class="main__close_button" appTrackClick fill="clear" name="Close" (click)="this.close()">
            <ion-icon class="main__close_button__icon" name="ux-close" color="uxsemidark"></ion-icon>
          </ion-button>
        </div>
        <div class="main__image">
          <img src="assets/img/defi-investments/success-investment.svg" />
        </div>
        <div class="main__primary_text ux-font-text-xl">
          <ion-text>{{ 'defi_investments.success_investment.title' | translate }}</ion-text>
        </div>
        <div class="main__secondary_text ux-font-text-base">
          <ion-text>{{ 'defi_investments.success_investment.subtitle' | translate }}</ion-text>
        </div>
        <div class="main__buttons">
          <ion-button
            appTrackClick
            color="uxsecondary primary"
            class="ux_button"
            expand="block"
            name="Go To Investments"
            (click)="this.goToInvestments()"
          >
            {{ 'defi_investments.success_investment.primaryButton' | translate }}
          </ion-button>
          <ion-button
            class="ux-button-outlined secondary"
            name="Go To Wallet"
            type="button"
            expand="block"
            (click)="this.goToWallet()"
            appTrackClick
          >
            {{ 'defi_investments.success_investment.secondaryButton' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./success-investment.page.scss'],
})
export class SuccessInvestmentPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  close() {
    this.navController.navigateBack(['tabs/home']);
  }

  goToInvestments() {
    this.navController.navigateForward(['tabs/investments/defi/options']);
  }

  goToWallet() {
    this.navController.navigateForward(['tabs/wallets']);
  }
}
