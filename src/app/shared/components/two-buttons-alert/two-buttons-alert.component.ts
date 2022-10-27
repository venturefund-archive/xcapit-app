import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-two-buttons-alert',
  template: `
    <div class="main__body modal-content">
      <div class="main__body__title">
        <ion-label class="ux-font-text-lg">{{ this.title }} </ion-label>
      </div>
      <div class="main__body__description">
        <ion-text class="ux-font-text-base">{{ this.description }} </ion-text>
      </div>
      <div class="main__actions">
        <ion-button
          class="ux-link-xl main__actions__button main__actions__button-back"
          fill="clear"
          name="cancel"
          (click)="this.cancel()"
        >
          {{ this.cancelButton }}
        </ion-button>
        <ion-button class="ux-link-xl main__actions__button" fill="clear" name="confirm" (click)="this.confirm()">
          {{ this.confirmButton }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./two-buttons-alert.component.scss'],
})
export class TwoButtonsAlertComponent {
  title: string;
  description: string;
  cancelButton: string;
  confirmButton: string;

  constructor(private modalController: ModalController) {}

  confirm() {
    this.modalController.dismiss(null, 'confirm');
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
