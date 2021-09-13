import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ApikeysTutorialModalComponent } from '../shared-apikeys/components/apikeys-tutorial-modal/apikeys-tutorial-modal.component';

@Component({
  selector: 'app-apikey-information',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'apikeys.apikey_information.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content apnf">
          <div class="apnf__title">
            <ion-text class="ux-font-text-lg">
              {{ 'apikeys.apikey_information.title' | translate }}
            </ion-text>
          </div>
          <div class="apnf__description">
            <ion-text class="ux-font-text-base">
              {{ 'apikeys.apikey_information.description' | translate }}
            </ion-text>
          </div>
          <div class="apnf__cards existing_apikey">
            <div class="apnf__cards__card" (click)="this.existingAPIKey()" appTrackClick name="Have API Key">
              <div class="apnf__cards__card__info">
                <ion-text class="ux-font-header-titulo apnf__cards__card__info__title">{{
                  'apikeys.apikey_information.cards.have_apikey.title' | translate
                }}</ion-text>
                <ion-text class="ux-font-text-xxs apnf__cards__card__info__description">
                  {{ 'apikeys.apikey_information.cards.have_apikey.description' | translate }}
                </ion-text>
              </div>
              <div class="apnf__cards__card__chevron">
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </div>
            </div>
            <div
              class="apnf__cards__card non_existing_apikey"
              (click)="this.nonExistingAPIKey()"
              appTrackClick
              name="Doesnt Have API Key"
            >
              <div class="apnf__cards__card__info">
                <ion-text class="ux-font-header-titulo apnf__cards__card__info__title">{{
                  'apikeys.apikey_information.cards.dont_have_apikey.title' | translate
                }}</ion-text>
                <ion-text class="ux-font-text-xxs apnf__cards__card__info__description">
                  {{ 'apikeys.apikey_information.cards.dont_have_apikey.description' | translate }}
                </ion-text>
              </div>
              <div class="apnf__cards__card__chevron">
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </div>
            </div>
          </div>
          <div class="apnf__need_help ux_footer">
            <ion-button name="Need Help" (click)="this.howToCreateAPIKey()" appTrackClick fill="clear" size="small">{{
              'apikeys.apikey_information.what_is_api_key' | translate
            }}</ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./apikey-information.page.scss'],
})
export class ApikeyInformationPage implements OnInit {
  constructor(private navController: NavController, private modalController: ModalController) {}

  ngOnInit() {}

  existingAPIKey() {
    this.navController.navigateForward('/apikeys/register');
  }

  howToCreateAPIKey() {
    // this.navController.navigateForward('') //TODO: Add Page
  }

  async nonExistingAPIKey() {
    const modal = await this.modalController.create({
      component: ApikeysTutorialModalComponent,
      componentProps: {
        title: 'apikeys.apikey_information.tutorial_modal.title',
        messages: [
          'apikeys.apikey_information.tutorial_modal.text1',
          'apikeys.apikey_information.tutorial_modal.text2',
          'apikeys.apikey_information.tutorial_modal.text3',
          'apikeys.apikey_information.tutorial_modal.text4',
          'apikeys.apikey_information.tutorial_modal.text5',
          'apikeys.apikey_information.tutorial_modal.text6',
          'apikeys.apikey_information.tutorial_modal.text7',
        ],
        buttonMessage: 'apikeys.apikey_information.tutorial_modal.button',
      },
      cssClass: 'ux-modal-apikeys-tutorial-no-apikeys',
      swipeToClose: false,
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'success') {
      this.existingAPIKey();
    }
  }
}
