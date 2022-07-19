import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-withdraw-info-modal',
  template: `
    <div class="main__close_button">
      <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
        <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
      </ion-button>
    </div>
    <div class="main__body">
      <div class="main__body__content">
        <ion-label class="ux-font-text-lg main__body__content__title"
          >{{ 'defi_investments.shared.withdraw_info_modal.title' | translate }}
        </ion-label>
        <div class="main__body__content__list">
          <ul class="ux-font-text-base main__body__content__list__items">
            <li *ngFor="let item of this.items">
              {{ item.description | translate }}
            </li>
          </ul>
        </div>
        <div class="main__actions">
          <ion-button
            class="ux_button main__actions__button ion-no-margin"
            name="Understood"
            color="secondary"
            size="large"
            (click)="this.close()"
          >
            {{ 'defi_investments.shared.withdraw_info_modal.button_text' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./withdraw-info-modal.component.scss'],
})
export class WithdrawInfoModalComponent implements OnInit {
  items = [
    { description: 'defi_investments.shared.withdraw_info_modal.item_1' },
    { description: 'defi_investments.shared.withdraw_info_modal.item_2' },
    { description: 'defi_investments.shared.withdraw_info_modal.item_3' },
  ];
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
