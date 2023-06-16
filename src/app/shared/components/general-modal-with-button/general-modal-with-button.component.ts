import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-general-modal-with-button',
  template: ` <div class="modal-content">
    <div class="header">
      <div class="header__close-button">
        <ion-button fill="clear" name="Close" (click)="this.close()">
          <ion-icon class="header__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
        </ion-button>
      </div>
      <div class="header__img">
        <img src="/assets/img/fiat-ramps/opeartion-km-in-progress/operation-km-in-progress.svg" alt="Operation Image" />
      </div>
    </div>
    <div class="main">
      <div class="main__title">
        <app-ux-title>{{ this.title | translate }}</app-ux-title>
      </div>
      <div class="main__description" *ngIf="this.description">
        <ion-text class="ux-font-text-base" [innerHTML]="this.description | translate"></ion-text>
      </div>
      <div class="main__action">
        <div class="main__actions__primary">
          <ion-button
            class="ux_button"
            color="secondary"
            name="Primary Action"
            (click)="this.primaryAction()"
            [disabled]="!this.url"
          >
            {{ this.buttonText | translate }}
          </ion-button>
        </div>
      </div>
      <div class="main__support">
        <app-whatsapp-support></app-whatsapp-support>
      </div>
    </div>
  </div>`,
  styleUrls: ['./general-modal-with-button.component.scss'],
})
export class GeneralModalWithButtonComponent {
  title: string;
  description: string;
  buttonText: string;
  url: string;

  constructor(private modalController: ModalController, private navController: NavController) {}

  close() {
    this.modalController.dismiss();
  }

  primaryAction() {
    this.navController.navigateForward(this.url);
    this.close();
  }
}
