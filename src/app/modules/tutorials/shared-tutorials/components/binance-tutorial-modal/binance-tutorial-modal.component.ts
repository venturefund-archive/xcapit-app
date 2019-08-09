import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BinanceCheckTutorialModalComponent } from '../binance-check-tutorial-modal/binance-check-tutorial-modal.component';

@Component({
  selector: 'app-binance-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'tutorials.binance_tutorial_modal.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h2>{{ 'tutorials.binance_tutorial_modal.t1' | translate }}</h2>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p1' | translate }}
        <a
          href="https://www.binance.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.binance.com <ion-icon name="open"></ion-icon>
        </a>
      </p>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p2' | translate }}
      </p>
      <img
        src="assets/img/tutorials/binance/binance-tutorial-img-1.png"
      >
      <p>
      {{ 'tutorials.binance_tutorial_modal.p3' | translate }}
      </p>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p4' | translate }}
      </p>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p5' | translate }}
      </p>
      <p class="tutorial__notes">
      {{ 'tutorials.binance_tutorial_modal.p6' | translate }}
      </p>
      <img
        src="assets/img/tutorials/binance/binance-tutorial-img-2.png"
      >
      <p>
      {{ 'tutorials.binance_tutorial_modal.p7' | translate }}
      </p>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p8' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance/binance-tutorial-img-3.png"
      ></ion-img>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p9' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance/binance-tutorial-img-4.png"
      ></ion-img>
      <p>{{ 'tutorials.binance_tutorial_modal.p10' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/binance/binance-tutorial-img-5.png"
      ></ion-img>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p11' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance/binance-tutorial-img-6.png"
      ></ion-img>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p12' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance/binance-tutorial-img-7.png"
      ></ion-img>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p13' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance/binance-tutorial-img-8.png"
      ></ion-img>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p14' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance/binance-tutorial-img-9.png"
      ></ion-img>
      <p>{{ 'tutorials.binance_tutorial_modal.p15' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/binance/binance-tutorial-img-10.png"
      ></ion-img>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p16' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance/binance-tutorial-img-11.png"
      ></ion-img>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p17' | translate }}
      </p>
      <ion-img
        src="assets/img/tutorials/binance/binance-tutorial-img-12.png"
      ></ion-img>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p18' | translate }}
      </p>
      <p>
      {{ 'tutorials.binance_tutorial_modal.p19' | translate }}
        <a class="local-a" (click)="this.openBinanceCheck()">
        {{ 'tutorials.binance_tutorial_modal.a1' | translate }}
        </a>
      </p>
    </ion-content>
  `,
  styleUrls: ['./binance-tutorial-modal.component.scss']
})
export class BinanceTutorialModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  async openBinanceCheck() {
    const modal = await this.modalController.create({
      component: BinanceCheckTutorialModalComponent
    });
    return await modal.present();
  }
}
