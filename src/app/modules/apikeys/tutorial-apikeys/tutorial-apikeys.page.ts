import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { LINKS } from '../../../config/static-links';

const { Browser } = Plugins;

@Component({
  selector: 'app-tutorial-apikeys',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'apikeys.tutorial_apikeys.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <div class="akt__title">
            <app-ux-title>{{ 'apikeys.tutorial_apikeys.title' | translate }}</app-ux-title>
          </div>
          <div class="akt__text_before">
            <app-ux-text>
              {{ 'apikeys.tutorial_apikeys.text_before' | translate }}
            </app-ux-text>
          </div>
          <div class="akt__text_before_2">
            <app-ux-text>
              {{ 'apikeys.tutorial_apikeys.text_before_2' | translate }}
            </app-ux-text>
          </div>
          <div class="akt__steps_container">
            <div class="akt__steps_container__steps">
              <ion-grid>
                <ion-row>
                  <ion-col size="2" class="ion-text-center"
                    ><img src="assets/img/apikeys/tutorial-apikeys/ux-step1.svg" alt="Step 1"
                  /></ion-col>
                  <ion-col>
                    <ion-text class="ux-font-text-base">
                      {{ 'apikeys.tutorial_apikeys.step1_before_icon' | translate }}
                      <ion-icon name="person-circle-outline"></ion-icon>
                      {{ 'apikeys.tutorial_apikeys.step1_after_icon' | translate }}
                    </ion-text>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="2" class="ion-text-center"
                    ><img src="assets/img/apikeys/tutorial-apikeys/ux-step2.svg" alt="Step 2"
                  /></ion-col>
                  <ion-col>
                    <ion-text class="ux-font-text-base">
                      {{ 'apikeys.tutorial_apikeys.step2' | translate }}
                    </ion-text>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="2" class="ion-text-center"
                    ><img src="assets/img/apikeys/tutorial-apikeys/ux-step3.svg" alt="Step 3"
                  /></ion-col>
                  <ion-col>
                    <ion-text class="ux-font-text-base">
                      {{ 'apikeys.tutorial_apikeys.step3' | translate }}
                    </ion-text>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </div>
          </div>
        </div>
        <div class="ux_footer">
          <div class="akt__text_help">
            <app-need-help
              [whatsAppLink]="this.supportLinks.apiKeyWhatsappSupport"
              [telegramLink]="this.supportLinks.apiKeyTelegramSupport"
            ></app-need-help>
          </div>
          <ion-button
            expand="block"
            type="button"
            color="uxsecondary"
            appTrackClick
            name="Link With Binance"
            (click)="this.linkWithBinance()"
          >
            {{ 'apikeys.tutorial_apikeys.link_with_binance' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./tutorial-apikeys.page.scss'],
})
export class TutorialApikeysPage implements OnInit {
  hasUnusedApiKeys = false;
  supportLinks = LINKS;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  linkWithBinance() {
    this.navController.navigateForward(['/apikeys/list', 'select']).then();
  }
}
