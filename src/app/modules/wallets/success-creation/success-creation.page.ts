import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-creation',
  template: ` <ion-content class="ion-padding" [scrollY]="false">
    <div class="main">
      <div class="main__primary_text ux-font-text-xl">
        <ion-text>{{ 'wallets.success_creation.title' | translate }}</ion-text>
      </div>
      <div class="main__secondary_text ux-font-text-base">
        <ion-text>{{ 'wallets.success_creation.subtitle' | translate }}</ion-text>
      </div>
      <div class="main__ux_success_image">
        <img src="../../../../assets/img/wallets/success_celebration.svg" />
      </div>
      <div class="main__actions">
        <div class="main__actions__primary">
          <ion-button appTrackClick color="uxsecondary" class="ux_button" name="Go To Home" (click)="this.goToHome()">
            {{ 'wallets.success_creation.success_button' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./success-creation.page.scss'],
})
export class SuccessCreationPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToHome() {
    this.navController.navigateBack(['tabs/wallets/']);
  }
}
