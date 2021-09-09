import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apikeys-tutorial-modal',
  template: `
    <div class="ion-padding atm">
      <ion-button size="small" fill="clear atm__close">
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
      <ion-button class="ux_button atm__button">
        {{ this.buttonMessage | translate }}
      </ion-button>
    </div>
  `,
  styleUrls: ['./apikeys-tutorial-modal.component.scss'],
})
export class ApikeysTutorialModalComponent implements OnInit {
  title: string;
  messages: string[];
  buttonMessage: string;

  constructor() {}

  ngOnInit() {}
}
