import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-binance-apikey-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'tutorials.binance_apikey_tutorial_modal.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h2 class="ion-text-center">{{ 'tutorials.binance_apikey_tutorial_modal.t1' | translate }}</h2>
      <p>{{ 'tutorials.binance_apikey_tutorial_modal.p1' | translate }}</p>
      <img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/1.png"
      >
      <p>{{ 'tutorials.binance_apikey_tutorial_modal.p2' | translate }}</p>
      <img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/2.png"
      >
      <p>{{ 'tutorials.binance_apikey_tutorial_modal.p3' | translate }}</p>
      <img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/3.png"
      >
      <p>{{ 'tutorials.binance_apikey_tutorial_modal.p4' | translate }}</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/4.png"
      ></ion-img>
      <p>{{ 'tutorials.binance_apikey_tutorial_modal.p5' | translate }}</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/5.png"
      ></ion-img>
      <p>{{ 'tutorials.binance_apikey_tutorial_modal.p6' | translate }}</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/6.png"
      ></ion-img>
      <p>{{ 'tutorials.binance_apikey_tutorial_modal.p7' | translate }}</p>
    </ion-content>
  `,
  styleUrls: ['./binance-apikey-tutorial-modal.component.scss']
})
export class BinanceApikeyTutorialModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
