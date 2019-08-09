import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BinanceAddressTutorialModalComponent } from '../binance-address-tutorial-modal/binance-address-tutorial-modal.component';

@Component({
  selector: 'app-binance-transfer-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'tutorials.binance_transfer_tutorial_modal.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="this.closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h2 class="ion-text-center">
        {{ 'tutorials.binance_transfer_tutorial_modal.t1' | translate }}
      </h2>
      <p class="ion-text-center">
        {{ 'tutorials.binance_transfer_tutorial_modal.p1' | translate }}
      </p>
      <p>
        {{ 'tutorials.binance_transfer_tutorial_modal.p2' | translate }}
      </p>
      <img
        src="assets/img/tutorials/binance-transfer/binance-transfer-tutorial-img-1.png"
        alt=""
      />
      <p>
        {{ 'tutorials.binance_transfer_tutorial_modal.p3' | translate }}
      </p>
      <p class="tutorial__notes">
        {{ 'tutorials.binance_transfer_tutorial_modal.p4' | translate }}
        <a class="local-a" (click)="this.openBinanceAddress()">
          {{ 'tutorials.binance_transfer_tutorial_modal.a1' | translate }}
        </a>
      </p>
      <p>
        {{ 'tutorials.binance_transfer_tutorial_modal.p5' | translate }}
      </p>
      <img
        src="assets/img/tutorials/binance-transfer/binance-transfer-tutorial-img-2.png"
        alt=""
      />
      <p>
        {{ 'tutorials.binance_transfer_tutorial_modal.p6' | translate }}
      </p>
    </ion-content>
  `,
  styleUrls: ['./binance-transfer-tutorial-modal.component.scss']
})
export class BinanceTransferTutorialModalComponent {
  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  async openBinanceAddress() {
    const modal = await this.modalController.create({
      component: BinanceAddressTutorialModalComponent
    });
    return await modal.present();
  }
}
