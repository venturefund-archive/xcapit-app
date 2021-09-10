import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-apikeys-tutorial-modal',
  template: `
    <div class="ion-padding atm">
      <ion-button name="Close" appTrackClick size="small" fill="clear atm__close" (click)="this.close()">
        <img src="assets/ux-icons/ux-close.svg" alt="Close" />
      </ion-button>
      <div class="atm__title">
        <ion-text class="ux-font-num-subtitulo" color="ux_dark">
          {{ this.title | translate }}
        </ion-text>
      </div>
      <div class="atm__text">
        <ol class="atm__text__list">
          <li *ngFor="let message of this.messages">
            <ion-text class="ux-font-text-base" color="ux_dark">
              {{ message | translate }}
            </ion-text>
          </li>
        </ol>
      </div>
      <div class="atm__footer">
        <ion-button
          name="I Have an Account"
          appTrackClick
          class="ux_button atm__footer__button"
          color="uxsecondary"
          size="large"
          (click)="this.closeAndNavigateForward()"
        >
          {{ this.buttonMessage | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./apikeys-tutorial-modal.component.scss'],
})
export class ApikeysTutorialModalComponent implements OnInit {
  title: string;
  messages: string[];
  buttonMessage: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss(null, 'cancel');
  }

  closeAndNavigateForward() {
    this.modalController.dismiss(null, 'success');
  }
}
