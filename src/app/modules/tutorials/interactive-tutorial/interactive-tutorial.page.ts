import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavController } from '@ionic/angular';
import { BinanceTutorialModalComponent } from '../shared-tutorials/components/binance-tutorial-modal/binance-tutorial-modal.component';
import { CaTutorialModalComponent } from '../shared-tutorials/components/ca-tutorial-modal/ca-tutorial-modal.component';
// tslint:disable-next-line: max-line-length
import { BinanceTransferTutorialModalComponent } from '../shared-tutorials/components/binance-transfer-tutorial-modal/binance-transfer-tutorial-modal.component';
import { ComponentRef } from '@ionic/core';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interactive-tutorial',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'tutorials.interactive_tutorial.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-slides [options]="this.slideOpts">
        <ion-slide>
          <div class="it__content-slide">
            <h2>{{ 'tutorials.interactive_tutorial.t1' | translate }}</h2>
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
                      {{
                        'tutorials.interactive_tutorial.no_button' | translate
                      }}
                    </ion-button>
                  </ion-col>
                  <ion-col size="6">
                    <ion-button
                      size="large"
                      expand="block"
                      color="success"
                      (click)="this.slideNext()"
                    >
                      {{
                        'tutorials.interactive_tutorial.yes_button' | translate
                      }}
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </div>
          </div>
        </ion-slide>
        <ion-slide>
          <div class="it__content-slide">
            <h2>{{ 'tutorials.interactive_tutorial.t2' | translate }}</h2>
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
                      {{
                        'tutorials.interactive_tutorial.no_button' | translate
                      }}
                    </ion-button>
                  </ion-col>
                  <ion-col size="6">
                    <ion-button
                      size="large"
                      expand="block"
                      color="success"
                      (click)="this.slideNext()"
                    >
                      {{
                        'tutorials.interactive_tutorial.yes_button' | translate
                      }}
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </div>
          </div>
        </ion-slide>
        <ion-slide>
          <div class="it__content-slide">
            <h2>{{ 'tutorials.interactive_tutorial.t3' | translate }}</h2>
            <div class="it__content-slide__buttons">
              <ion-grid>
                <ion-row>
                  <ion-col size="6">
                    <ion-button
                      size="large"
                      expand="block"
                      color="primary"
                      (click)="this.openBinanceTransferTutorial()"
                    >
                      {{
                        'tutorials.interactive_tutorial.no_button' | translate
                      }}
                    </ion-button>
                  </ion-col>
                  <ion-col size="6">
                    <ion-button
                      size="large"
                      expand="block"
                      color="success"
                      routerDirection="forward"
                      [replaceUrl]="true"
                      [routerLink]="['/funds/new']"
                    >
                      {{
                        'tutorials.interactive_tutorial.yes_button' | translate
                      }}
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

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  ngOnInit() {}

  openCaTutorial() {
    return this.openModal(CaTutorialModalComponent, 'onWillDismiss', () =>
      this.navController
        .navigateBack(['/funds/list'], { replaceUrl: true })
        .then(() =>
          this.toastService.showToast({
            message: this.translate.instant(
              'tutorials.interactive_tutorial.no_cryptos_text'
            )
          })
        )
    );
  }

  openBinanceTutorial() {
    return this.openModal(BinanceTutorialModalComponent);
  }

  openBinanceTransferTutorial() {
    return this.openModal(BinanceTransferTutorialModalComponent);
  }

  async openModal(
    component: ComponentRef,
    methodName: string = '',
    callback: any = null
  ) {
    const modal = await this.modalController.create({ component });
    if (callback) {
      modal[methodName]().then(callback);
    }
    return await modal.present();
  }

  slideNext() {
    this.slide.slideNext();
  }
}
