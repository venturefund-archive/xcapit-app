import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-provider',
  template: `
    <div class="main">
      <div class="main__close_button">
        <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" appTrackClick (click)="this.close()">
          <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
        </ion-button>
      </div>
      <div class="main__body">
        <div class="main__body__content">
          <div class="main__body__content__img">
            <img [src]="this.image" />
          </div>
          <div class="main__body__content__title">
            <ion-text class="ux-font-text-xl">{{ this.title }} </ion-text>
          </div>
          <div class="main__body__content__subtitle">
            <ion-text class="ux-font-header-titulo">{{ this.subtitle1 }} </ion-text>
          </div>
          <div class="main__body__content__description">
            <ion-text class="ux-font-text-base">
              {{ this.description1 }}
            </ion-text>
          </div>
          <div class="main__body__content__subtitle">
            <ion-text class="ux-font-header-titulo">{{ this.subtitle2 }} </ion-text>
          </div>
          <div class="main__body__content__description">
            <ion-text class="ux-font-text-base">
              {{ this.description2 }}
            </ion-text>
          </div>
          <div class="main__body__content__disclaimer" *ngIf="this.disclaimer">
            <ion-text class="ux-font-text-xxs">{{ this.disclaimer }} </ion-text>
          </div>
          <div class="main__actions">
            <ion-button
              class="ux_button main__actions__button ion-no-margin"
              name="Understood"
              color="secondary"
              size="large"
              (click)="this.close()"
            >
              {{ this.buttonText }}
            </ion-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./info-provider.component.scss'],
})
export class InfoProviderComponent implements OnInit {
  image: string;
  title: string;
  subtitle1: string;
  subtitle2: string;
  description1: string;
  description2: string;
  disclaimer: string;
  buttonText: string;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
