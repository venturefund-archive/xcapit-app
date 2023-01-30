import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-as-alert',
  template: `<div class="maa__body">
    <div class="maa__body__content">
      <div class="maa__body__content__title">
        <ion-label class="ux-font-text-lg">{{ this.title }} </ion-label>
      </div>
      <div class="maa__body__content__description">
        <ion-label color="neutral90" class="ux-font-text-base ion-no-margin">
          {{ this.message }}
        </ion-label>
      </div>
    </div>
    <div class="maa__actions">
      <ion-button
        class="ux-link-xl maa__actions__button maa__actions__button-back"
        fill="clear"
        name="cancel"
        (click)="close()"
      >
        {{ this.textCancelButton }}
      </ion-button>
      <ion-button
        class="ux-link-xl maa__actions__button"
        fill="clear"
        name="confirm"
        appTrackClick
        (click)="this.confirm()"
      >
        {{ this.textConfirmButton }}
      </ion-button>
    </div>
  </div>`,
  styleUrls: ['./modal-as-alert.component.scss'],
})
export class ModalAsAlertComponent {
  title: string;
  message: string;
  textCancelButton: string;
  textConfirmButton: string;

  constructor(private modalController: ModalController) {}

  close() {
    this.modalController.dismiss('cancel');
  }

  confirm() {
    this.modalController.dismiss('confirm');
  }
}
