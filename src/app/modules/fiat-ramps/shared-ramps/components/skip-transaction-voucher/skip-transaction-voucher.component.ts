import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-skip-transaction-voucher',
  template: `<div class="modal-content">
    <div class="main__body">
      <div class="main__body__content">
        <div class="main__body__content__title">
          <ion-label class="ux-font-text-lg">{{ this.title | translate }} </ion-label>
        </div>
        <div class="main__body__content__description">
          <ion-label color="neutral90" class="ux-font-text-base ion-no-margin">
            {{ this.description | translate }}
          </ion-label>
        </div>
      </div>
      <div class="main__actions">
        <ion-button
          class="ux-link-xl main__actions__button main__actions__button-back"
          fill="clear"
          name="cancel_skip_modal"
          (click)="close()"
        >
          {{ this.buttonText1 | translate }}
        </ion-button>
        <ion-button
          class="ux-link-xl main__actions__button"
          fill="clear"
          name="out_skip_modal"
          appTrackClick
          type="delete"
          (click)="this.handleDelete()"
        >
          {{ this.buttonText2 | translate }}
        </ion-button>
      </div>
    </div>
  </div>`,
  styleUrls: ['./skip-transaction-voucher.component.scss'],
})
export class SkipTransactionVoucherComponent implements OnInit {
  title: string;
  description: string;
  buttonText1: string;
  buttonText2: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  handleDelete() {
    this.modalController.dismiss('secondaryAction');
  }

  close() {
    this.modalController.dismiss();
  }
}
