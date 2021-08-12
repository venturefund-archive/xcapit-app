import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-payments-success',
  template: `
    <ion-content class="ion-padding">
      <div class="main">
        <div class="main__close_button">
          <ion-button appTrackClick fill="clear" name="Close" (click)="this.close()">
            <ion-icon class="main__close_button__icon" name="ux-close" color="uxmedium"></ion-icon>
          </ion-button>
        </div>
        <div class="main__ux_success_image">
          <img src="../../../../assets/img/payment-methods/Success.svg" />
        </div>
        <div class="main__primary_text ux-font-text-xl">
          <ion-text>{{ 'payment.success.textPrimary' | translate }}</ion-text>
        </div>
        <div class="main__secondary_text ux-font-text-xs">
          <ion-text>{{ 'payment.success.textSecondary' | translate }}</ion-text>
        </div>
        <div class="main__actions">
          <div class="main__actions__primary">
            <ion-button appTrackClick class="ux_button" name="Continue" (click)="this.continue()">
              {{ 'payment.success.textBtn' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./payment-success.page.scss'],
})
export class PaymentSuccessPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  continue() {
    this.navController.navigateForward(['/tabs/funds']);
  }

  close() {
    this.navController.navigateBack(['/tabs/funds']);
  }
}
