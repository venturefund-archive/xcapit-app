import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-token-info-modal',
  template: `<div class="modal-content ntim">
    <div class="ntim__img-container">
      <div class="ntim__close_button">
        <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
          <ion-icon class="ntim__close_button__icon" name="ux-close" color="primary"></ion-icon>
        </ion-button>
      </div>
      <div class="ntim__img-container__img">
        <img [src]="this.image" />
      </div>
    </div>
    <div class="ntim__title ux-font-text-xl">
      <ion-text>{{ this.title | translate }}</ion-text>
    </div>
    <div class="ntim__subtitle ux-font-text-base">
      <ion-text [innerHTML]="this.subtitle"></ion-text>
    </div>
  </div>`,
  styleUrls: ['./new-token-info-modal.component.scss'],
})
export class NewTokenInfoModalComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() image: string;

  constructor(private modalController: ModalController) {}

  close() {
    this.modalController.dismiss();
  }
}
