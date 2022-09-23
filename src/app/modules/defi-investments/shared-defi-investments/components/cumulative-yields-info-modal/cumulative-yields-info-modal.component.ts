import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cumulative-yields-info-modal',
  template: `
  <ion-card class="cyi">
    <div class="cyi__top-bar">
    <!-- TODO: Test this -->
    <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
      <ion-icon name="ux-close"></ion-icon>
    </ion-button>
    </div>
    <div class="cyi__title">
      <ion-text class="ux-font-text-lg">{{ 'defi_investments.invest_detail.yields.info_modal.title' | translate }}</ion-text>
    </div>
    <!-- TODO: Fix list padding and bullet size -->
    <ul class="cyi__text">
      <li>
        <ion-text class="ux-font-text-base">{{ 'defi_investments.invest_detail.yields.info_modal.item1' | translate }}</ion-text>
      </li>
      <li>
        <ion-text class="ux-font-text-base">{{ 'defi_investments.invest_detail.yields.info_modal.item2' | translate }}</ion-text>
      </li>
    </ul>
    <div class="cyi__button">
    <!-- TODO: Test this -->
    <ion-button class="ux_button" expand="block" color="secondary" (click)="this.close()">{{ 'defi_investments.invest_detail.yields.info_modal.button' | translate }}</ion-button>
    </div>
  </ion-card>
  `,
  styleUrls: ['./cumulative-yields-info-modal.component.scss'],
})
export class CumulativeYieldsInfoModalComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss();
  }

}
