import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-send-modal',
  template: `
  <div class="modal-content">
    <div class="main__close_button">
      <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
        <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
      </ion-button>
    </div>
    <div class="main__body">
      <div class="main__body__content">
        <ion-label class="ux-font-text-lg main__body__content__title">{{ this.title }} </ion-label>
        <div *ngIf="this.state != undefined" class="main__body__content__state">
          <ion-badge
            class="ux-badge ux-font-num-subtitulo"
            [ngClass]="{ confirmed: this.state, declined: !this.state }"
          >
            {{ (this.state ? 'wallets.transactions.confirmed' : 'wallets.transactions.declined') | translate }}
          </ion-badge>
        </div>
        <ion-label class="ion-no-margin ux-font-text-base main__body__content__description">
          {{ this.description }}
        </ion-label>
        <div class="main__actions">
          <ion-button
            class="ux_button main__actions__button ion-no-margin"
            name="Understood"
            color="secondary"
            size="large"
            (click)="this.close()"
          >
            {{ this.buttonText }}
          </ion-button>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./info-send-modal.component.scss'],
})
export class InfoSendModalComponent implements OnInit {
  title: string;
  description: string;
  buttonText: string;
  @Input() state?: boolean;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
