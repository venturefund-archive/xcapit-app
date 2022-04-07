import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-paxful',
  template: `
    <ion-content class="ion-padding">
      <div class="main">
        <div class="main__close_button">
          <ion-button appTrackClick fill="clear" name="Close Success" (click)="this.close()">
            <ion-icon class="main__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
          </ion-button>
        </div>
        <div class="main__ux_success_image">
          <img src="../../../../assets/img/fiat-ramps/success-paxful/to-paxful.svg" />
        </div>
        <div class="main__primary_text ux-font-text-xl">
          <ion-text>{{ 'fiat_ramps.paxful_success.textPrimary' | translate }}</ion-text>
        </div>
        <div class="main__secondary_text ux-font-text-xs">
          <ion-text>{{ 'fiat_ramps.paxful_success.textSecondary' | translate }}</ion-text>
        </div>
        <div class="main__actions">
          <div class="main__actions__primary">
            <ion-button
              appTrackClick
              color="secondary"
              class="ux_button"
              name="My Operations"
              (click)="this.goToMyOperations()"
            >
              {{ 'fiat_ramps.paxful_success.namePrimaryAction' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./success-paxful.page.scss'],
})
export class SuccessPaxfulPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  close() {
    this.navController.navigateBack(['/tabs/home']);
  }

  goToMyOperations() {
    this.navController.navigateForward(['/fiat-ramps/operations']);
  }
}
