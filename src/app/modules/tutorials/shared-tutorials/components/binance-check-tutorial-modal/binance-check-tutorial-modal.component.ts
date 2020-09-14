import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-binance-check-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'tutorials.binance_check_tutorial_modal.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>{{ 'tutorials.binance_check_tutorial_modal.t1' | translate }}</h2>
      <p>
        {{ 'tutorials.binance_check_tutorial_modal.p1' | translate }}
        <a
          href="https://www.binance.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.binance.com <ion-icon name="open"></ion-icon>
        </a>
      </p>
      <p>
        {{ 'tutorials.binance_check_tutorial_modal.p2' | translate }}
      </p>
      <p class="tutorial__notes">
        {{ 'tutorials.binance_check_tutorial_modal.p3' | translate }}
      </p>
      <img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-1.png"
      />
      <p>{{ 'tutorials.binance_check_tutorial_modal.p4' | translate }}</p>
      <img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-2.png"
      />
      <p>{{ 'tutorials.binance_check_tutorial_modal.p5' | translate }}</p>
      <img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-3.png"
      />
      <p>{{ 'tutorials.binance_check_tutorial_modal.p6' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-4.png"
      ></ion-img>
      <p>
        {{ 'tutorials.binance_check_tutorial_modal.p7' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-5.png"
      ></ion-img>
      <p>
        {{ 'tutorials.binance_check_tutorial_modal.p8' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-6.png"
      ></ion-img>
      <p>
        {{ 'tutorials.binance_check_tutorial_modal.p9' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-7.png"
      ></ion-img>
      <p>
        {{ 'tutorials.binance_check_tutorial_modal.p10' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-8.png"
      ></ion-img>
      <p>
        {{ 'tutorials.binance_check_tutorial_modal.p11' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-9.png"
      ></ion-img>
      <p>{{ 'tutorials.binance_check_tutorial_modal.p12' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-10.png"
      ></ion-img>
      <p>
        {{ 'tutorials.binance_check_tutorial_modal.p13' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance-check/binance-check-tutorial-img-11.png"
      ></ion-img>
      <p>
        {{ 'tutorials.binance_check_tutorial_modal.p14' | translate }}
      </p>
      <p>
        {{ 'tutorials.binance_check_tutorial_modal.p15' | translate }}
      </p>
    </ion-content>
  `,
  styleUrls: ['./binance-check-tutorial-modal.component.scss']
})
export class BinanceCheckTutorialModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
