import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TrackService } from '../../services/track/track.service';

@Component({
  selector: 'app-success-modal',
  template: `<div class="modal-content">
    <div class="main__close_button">
      <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
        <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
      </ion-button>
    </div>
    <div class="main__body">
      <div class="main__body__content">
        <div class="main__body__content__img">
          <img src="assets/img/wallets/success-backup.svg" />
        </div>
        <div class="main__body__content__title">
          <ion-text class="ux-font-text-lg">{{ this.title | translate }} </ion-text>
        </div>
        <div class="main__body__content__description">
          <ion-text class="ux-font-text-base">
            {{ this.description | translate }}
          </ion-text>
        </div>
        <div class="main__actions">
          <ion-button
            class="ux_button main__actions__button ion-no-margin"
            name="ux_go_to_wallet"
            color="secondary"
            size="large"
            (click)="this.goToWalletHome()"
          >
            {{ this.buttonText | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./success-modal.component.scss'],
})
export class SuccessModalComponent implements OnInit {
  title: string;
  description: string;
  buttonText: string;

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private trackService: TrackService
  ) {}

  ngOnInit() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_bkupgdrive_success',
    });
  }

  goToWalletHome() {
    this.navController.navigateForward('tabs/wallets');
  }

  close() {
    this.modalController.dismiss();
  }
}
