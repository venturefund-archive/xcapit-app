import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-ca-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'tutorials.ca_tutorial_modal.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="this.closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h2>{{ 'tutorials.ca_tutorial_modal.t1' | translate }}</h2>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p1' | translate }}
      </p>

      <p>
      {{ 'tutorials.ca_tutorial_modal.p2' | translate }}
      </p>

      <p>
      {{ 'tutorials.ca_tutorial_modal.p3' | translate }}
      </p>

      <hr />

      <h2 class="ion-text-center">{{ 'tutorials.ca_tutorial_modal.t2' | translate }}</h2>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p4' | translate }}
        <a
          href="https://bitex.la/auth/signup?r=WCS"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.bitex.la <ion-icon name="open"></ion-icon>
        </a>
      </p>
      <p>{{ 'tutorials.ca_tutorial_modal.p5' | translate }}</p>
      <img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/1.png"
      >
      <p>
      {{ 'tutorials.ca_tutorial_modal.p6' | translate }}
      </p>
      <p class="tutorial__notes">
      {{ 'tutorials.ca_tutorial_modal.p7' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/2.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p8' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/3.png"
      ></ion-img>
      <p>{{ 'tutorials.ca_tutorial_modal.p9' | translate }}</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/4.png"
      ></ion-img>
      <p class="tutorial__notes">
      {{ 'tutorials.ca_tutorial_modal.p10' | translate }}
      </p>
      <ul>
        <li>
        {{ 'tutorials.ca_tutorial_modal.ul1li1' | translate }}
        </li>
        <li>
        {{ 'tutorials.ca_tutorial_modal.ul1li2' | translate }}
        </li>
        <li>{{ 'tutorials.ca_tutorial_modal.ul1li3' | translate }}</li>
        <li>{{ 'tutorials.ca_tutorial_modal.ul1li4' | translate }}</li>
      </ul>

      <hr />

      <p>
      {{ 'tutorials.ca_tutorial_modal.p11' | translate }}
      </p>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p12' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/5.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p13' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/6.png"
      ></ion-img>
      <p>{{ 'tutorials.ca_tutorial_modal.p14' | translate }}</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/7.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p15' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/8.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p16' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/9.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p17' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/10.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p18' | translate }}
      </p>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p19' | translate }}
      </p>
      <p>{{ 'tutorials.ca_tutorial_modal.p20' | translate }}</p>

      <hr />

      <h2 class="ion-text-center">
      {{ 'tutorials.ca_tutorial_modal.t3' | translate }}
      </h2>
      <p class="ion-text-center">
      {{ 'tutorials.ca_tutorial_modal.p21' | translate }}
      </p>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p22' | translate }}
        <a
          href="https://bitex.la"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.bitex.la <ion-icon name="open"></ion-icon>
        </a>
      </p>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p23' | translate }}
      </p>
      <p class="tutorial__notes">
      {{ 'tutorials.ca_tutorial_modal.p24' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/1.png"
      ></ion-img>
      <p>{{ 'tutorials.ca_tutorial_modal.p25' | translate }}</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/2.png"
      ></ion-img>
      <p>{{ 'tutorials.ca_tutorial_modal.p26' | translate }}</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/3.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p27' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/4.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p28' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/6.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p29' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/7.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p30' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/8.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p31' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/9.png"
      ></ion-img>
      <p>{{ 'tutorials.ca_tutorial_modal.p32' | translate }}</p>

      <hr />

      <h2 class="ion-text-center">{{ 'tutorials.ca_tutorial_modal.t4' | translate }}</h2>
      <p class="ion-text-center">
      {{ 'tutorials.ca_tutorial_modal.p33' | translate }}
      </p>
      <p>{{ 'tutorials.ca_tutorial_modal.p34' | translate }}</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/comprarCryptos/es/1.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p35' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/comprarCryptos/es/2.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p36' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/comprarCryptos/es/3.png"
      ></ion-img>
      <p class="tutorial__notes">
      {{ 'tutorials.ca_tutorial_modal.p37' | translate }}
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/comprarCryptos/es/4.png"
      ></ion-img>
      <p>
      {{ 'tutorials.ca_tutorial_modal.p38' | translate }}
      </p>
    </ion-content>
  `,
  styleUrls: ['./ca-tutorial-modal.component.scss']
})
export class CaTutorialModalComponent {
  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }
}
