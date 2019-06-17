import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { BinanceTutorialModalComponent } from '../shared-tutorials/components/binance-tutorial-modal/binance-tutorial-modal.component';
import { CaTutorialModalComponent } from '../shared-tutorials/components/ca-tutorial-modal/ca-tutorial-modal.component';

@Component({
  selector: 'app-interactive-tutorial',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>interactive-tutorial</ion-title>
        <ion-buttons slot="end">
          <ion-button
            color="primary"
            [routerLink]="['/funds/new']"
          >
            Omitir
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-slides [options]="this.slideOpts">
        <ion-slide>
          <div class="it__content-slide">
            <h2>¿Tenés Cryptoactivos?</h2>
            <div class="it__content-slide__buttons">
              <ion-grid>
                <ion-row>
                  <ion-col size="6">
                    <ion-button
                      size="large"
                      expand="block"
                      color="primary"
                      (click)="this.openCaTutorial()"
                    >
                      No
                    </ion-button>
                  </ion-col>
                  <ion-col size="6">
                    <ion-button
                      size="large"
                      expand="block"
                      color="success"
                      (click)="this.slideNext()"
                    >
                      Si
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </div>
          </div>
        </ion-slide>
        <ion-slide>
          <div class="it__content-slide">
            <h2>¿Tenés Cuenta en Binance?</h2>
            <div class="it__content-slide__buttons">
              <ion-grid>
                <ion-row>
                  <ion-col size="6">
                    <ion-button
                      size="large"
                      expand="block"
                      color="primary"
                      (click)="this.openBinanceTutorial()"
                    >
                      No
                    </ion-button>
                  </ion-col>
                  <ion-col size="6">
                    <ion-button
                      size="large"
                      expand="block"
                      color="success"
                      [routerLink]="['/funds/new']"
                    >
                      Si
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </div>
          </div>
        </ion-slide>
      </ion-slides>
    </ion-content>
  `,
  styleUrls: ['./interactive-tutorial.page.scss']
})
export class InteractiveTutorialPage implements OnInit {
  @ViewChild(IonSlides) slide: IonSlides;

  constructor(private modalController: ModalController) {}

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  ngOnInit() {}

  async openCaTutorial() {
    const modal = await this.modalController.create({
      component: CaTutorialModalComponent
    });
    return await modal.present();
  }

  async openBinanceTutorial() {
    const modal = await this.modalController.create({
      component: BinanceTutorialModalComponent
    });
    return await modal.present();
  }

  slideNext() {
    this.slide.slideNext();
  }
}
