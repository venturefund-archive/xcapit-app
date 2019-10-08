import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-binance-address-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'tutorials.binance_address_tutorial_modal.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="this.closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>{{ 'tutorials.binance_address_tutorial_modal.t1' | translate }}</h2>
      <p>{{ 'tutorials.binance_address_tutorial_modal.p1' | translate }}</p>
      <img
        src="assets/img/tutorials/binance-address/binance-address-tutorial-img-1.png"
      />
      <p>{{ 'tutorials.binance_address_tutorial_modal.p2' | translate }}</p>
      <img
        src="assets/img/tutorials/binance-address/binance-address-tutorial-img-2.png"
      />
      <p>{{ 'tutorials.binance_address_tutorial_modal.p3' | translate }}</p>
      <img
        src="assets/img/tutorials/binance-address/binance-address-tutorial-img-3.png"
      />
      <p>{{ 'tutorials.binance_address_tutorial_modal.p4' | translate }}</p>
      <p>{{ 'tutorials.binance_address_tutorial_modal.p5' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/binance-address/binance-address-tutorial-img-4.png"
      ></ion-img>
    </ion-content>
  `,
  styleUrls: ['./binance-address-tutorial-modal.component.scss']
})
export class BinanceAddressTutorialModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
