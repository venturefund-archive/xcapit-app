import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-whats-an-api-key',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/apikeys/apikey-information"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'apikeys.whats_an_api_key.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main waak">
        <div class="ux_content">
          <div class="waak__title">
            <ion-text class="ux-font-text-lg">
              {{ 'apikeys.whats_an_api_key.title' | translate }}
            </ion-text>
          </div>
          <div class="waak__description">
            <ion-text class="ux-font-text-base">
              {{ 'apikeys.whats_an_api_key.description' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="ux_footer">
          <ion-button
            appTrackClick
            name="Done"
            color="uxsecondary"
            class="ux_button waak__button"
            (click)="this.goToRegisterAPIKey()"
          >
            {{ 'apikeys.whats_an_api_key.button' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./whats-an-api-key.page.scss'],
})
export class WhatsAnApiKeyPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToRegisterAPIKey() {
    this.navController.navigateForward('/apikeys/register');
  }
}
