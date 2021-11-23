import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ApikeysTutorialModalComponent } from '../shared-apikeys/components/apikeys-tutorial-modal/apikeys-tutorial-modal.component';

@Component({
  selector: 'app-tutorial-exchange',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'apikeys.exchange_information.header' | translate }}</ion-title>
        <ion-label class="step_counter" slot="end">1 {{ 'shared.step_counter.of' | translate }} 3</ion-label>
      </ion-toolbar>
      <app-ux-step-progress-bar progress="40%"> </app-ux-step-progress-bar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content aei">
          <div class="aei__title">
            <ion-text class="ux-font-text-lg">
              {{ 'apikeys.exchange_information.title' | translate }}
            </ion-text>
          </div>
          <div class="aei__description">
            <ion-text class="ux-font-text-base">
              {{ 'apikeys.exchange_information.description' | translate }}
            </ion-text>
          </div>
          <div class="aei__cards existing_account">
            <div class="aei__cards__card" (click)="this.accountExist()" appTrackClick name="Have Binance Account">
              <div class="aei__cards__card__info">
                <ion-text class="ux-font-header-titulo aei__cards__card__info__title">{{
                  'apikeys.exchange_information.cards.have_exchange_account.title' | translate
                }}</ion-text>
                <ion-text class="ux-font-text-xxs aei__cards__card__info__description">
                  {{ 'apikeys.exchange_information.cards.have_exchange_account.description' | translate }}
                </ion-text>
              </div>
              <div class="aei__cards__card__chevron">
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </div>
            </div>
            <div
              class="aei__cards__card non_existing_account"
              (click)="this.accountDoesntExist()"
              appTrackClick
              name="Doesnt Have Binance Account"
            >
              <div class="aei__cards__card__info">
                <ion-text class="ux-font-header-titulo aei__cards__card__info__title">{{
                  'apikeys.exchange_information.cards.dont_have_exchange_account.title' | translate
                }}</ion-text>
                <ion-text class="ux-font-text-xxs aei__cards__card__info__description">
                  {{ 'apikeys.exchange_information.cards.dont_have_exchange_account.description' | translate }}
                </ion-text>
              </div>
              <div class="aei__cards__card__chevron">
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </div>
            </div>
          </div>
          <div class="aei__information_card">
            <div class="aei__information_card__image">
              <ion-icon name="ux-info"></ion-icon>
            </div>
            <div>
              <ion-text class="ux-font-input-label aei__information_card__text">
                {{ 'apikeys.exchange_information.information_card' | translate }}</ion-text
              >
            </div>
          </div>
        </div>
        <div class="aei__need_help ux_footer">
          <ion-button name="Need Help" class="ux-link-xs" (click)="this.needHelp()" appTrackClick fill="clear">{{
            'shared.need_help.text_help_link' | translate
          }}</ion-button>
        </div>
      </div>
    </ion-content>
  `,

  styleUrls: ['./tutorial-exchange.page.scss'],
})
export class TutorialExchangePage implements OnInit {
  constructor(private navController: NavController, private modalController: ModalController) {}

  ngOnInit() {}

  accountExist() {
    this.navController.navigateForward('/apikeys/tutorial/apikeys');
  }

  accountDoesntExist() {
    this.navController.navigateForward(['/apikeys/how-create-binance-account']);
  }

  needHelp() {
    this.navController.navigateForward('/tickets/create-support-ticket');
  }
}
