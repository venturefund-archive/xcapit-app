import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-extract-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'tutorials.extract_tutorial_modal.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="this.closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h2>{{ 'tutorials.extract_tutorial_modal.t1' | translate }}</h2>
      <p>
        {{ 'tutorials.extract_tutorial_modal.p1' | translate }}
      </p>
      <img
        src="assets/img/tutorials/extract/extract-tutorial-app-img-1.png"
        alt=""
      />
      <p>{{ 'tutorials.extract_tutorial_modal.p2' | translate }}</p>
      <img
        src="assets/img/tutorials/extract/extract-tutorial-app-img-2.png"
        alt=""
      />
      <p>{{ 'tutorials.extract_tutorial_modal.p3' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-app-img-3.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p4' | translate }}</p>
      <p>{{ 'tutorials.extract_tutorial_modal.p5' | translate }}</p>

      <hr />

      <h2>{{ 'tutorials.extract_tutorial_modal.t2' | translate }}</h2>
      <p>
        {{ 'tutorials.extract_tutorial_modal.p6' | translate }}
        <a
          href="https://www.bitex.la/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.bitex.la/ <ion-icon name="open"></ion-icon>
        </a>
      </p>
      <p>{{ 'tutorials.extract_tutorial_modal.p7' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-4.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p8' | translate }}</p>
      <p>{{ 'tutorials.extract_tutorial_modal.p9' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-5.png"
      ></ion-img>
      <!-- Que onda con esto 👇 -->
      <p>{{ 'tutorials.extract_tutorial_modal.p10' | translate }}</p>
      <p>{{ 'tutorials.extract_tutorial_modal.p11' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-6.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p12' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-7.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p13' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-8.png"
      ></ion-img>

      <hr />

      <h2>{{ 'tutorials.extract_tutorial_modal.t3' | translate }}</h2>
      <p>
        {{ 'tutorials.extract_tutorial_modal.p14' | translate }}
        <a
          href="https://www.binance.com/?ref=36552775"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.binance.com <ion-icon name="open"></ion-icon>
        </a>
      </p>
      <p>{{ 'tutorials.extract_tutorial_modal.p15' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-9.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p16' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-10.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p17' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-11.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p18' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-12.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p19' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-13.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p20' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-14.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p21' | translate }}</p>

      <hr />

      <h2>{{ 'tutorials.extract_tutorial_modal.t4' | translate }}</h2>
      <p>
        {{ 'tutorials.extract_tutorial_modal.p22' | translate }}
        <a
          href="https://www.bitex.la/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.bitex.la/ <ion-icon name="open"></ion-icon>
        </a>
      </p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-15.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p23' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-16.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p24' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-17.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p25' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-18.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p26' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-19.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p27' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-20.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p28' | translate }}</p>

      <hr />

      <h2>{{ 'tutorials.extract_tutorial_modal.t5' | translate }}</h2>
      <p>
        {{ 'tutorials.extract_tutorial_modal.p29' | translate }}
        <a
          href="https://www.bitex.la/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.bitex.la/ <ion-icon name="open"></ion-icon>
        </a>
      </p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-21.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p30' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-22.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p31' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-23.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p32' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-24.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p33' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-25.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p34' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-26.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p35' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-27.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p36' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-28.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p37' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-29.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p38' | translate }}</p>
      <ion-img
        src="assets/img/tutorials/extract/extract-tutorial-img-30.png"
      ></ion-img>
      <p>{{ 'tutorials.extract_tutorial_modal.p39' | translate }}</p>
      <p>{{ 'tutorials.extract_tutorial_modal.p40' | translate }}</p>
    </ion-content>
  `,
  styleUrls: ['./extract-tutorial-modal.component.scss']
})
export class ExtractTutorialModalComponent {
  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }
}
