import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-no-apikeys-modal',
  template: `
    <div class="nam ux_main">
      <div class="nam__content ux_content">
        <div class="nam__content__header">
          <div class="nam__content__header__text"></div>
          <div class="nam__content__header__text">
            <ion-text class="ux-font-lato ux-fweight-extrabold ux-fsize-17">
              {{ 'funds.fund_investment.no_apikeys_modal.first_title' | translate }}
            </ion-text>
          </div>
          <div class="nam__content__header__close_button">
            <ion-button
              appTrackClick
              class="nam__content__header__close_button"
              name="Close"
              size="small"
              fill="clear"
              (click)="this.close()"
            >
              <ion-icon name="close-outline"></ion-icon>
            </ion-button>
          </div>
        </div>
        <div class="nam__content__img">
          <img src="assets/img/apikeys/no-apikey.svg" />
        </div>
        <div class="nam__content__second_title">
          <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-15">
            {{ 'funds.fund_investment.no_apikeys_modal.second_title' | translate }}
          </ion-text>
        </div>
        <div class="nam__content__message">
          <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-14">
            {{ 'funds.fund_investment.no_apikeys_modal.message' | translate }}
          </ion-text>
        </div>
      </div>
      <div class="ux_footer">
        <div class="nam__content__buttons ">
          <ion-button
            expand="block"
            type="button"
            color="secondary"
            appTrackClick
            name="Register New Key"
            (click)="this.addApiKey()"
          >
            {{ 'funds.fund_investment.no_apikeys_modal.button' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./no-apikeys-modal.component.scss'],
})
export class NoApikeysModalComponent implements OnInit {
  constructor(private modalController: ModalController, private navController: NavController) {}

  ngOnInit() {}

  addApiKey() {
    this.close();
    this.navController.navigateForward('/apikeys/register');
  }

  close(state: string = 'canceled') {
    this.modalController.dismiss(null, state);
  }
}
