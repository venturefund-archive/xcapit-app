import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-provider',
  template: `
    <div class="modal-content">
      <div class="main">
        <div class="main__close_button">
          <ion-button
            class="ion-no-padding"
            slot="icon-only"
            fill="clear"
            name="Close"
            appTrackClick
            (click)="this.close()"
          >
            <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
          </ion-button>
        </div>
        <div class="main__body">
          <div class="main__body__content">
            <div class="main__body__content__img">
              <img [src]="this.image" />
            </div>
            <div class="main__body__content__title">
              <ion-text class="ux-font-text-xl">{{ this.title | translate }} </ion-text>
            </div>
            <div *ngIf="this.subtitle1" class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{ this.subtitle1 | translate }} </ion-text>
            </div>
            <div *ngIf="this.description1" class="main__body__content__description">
              <ion-text class="ux-font-text-base">
                {{ this.description1 | translate }}
              </ion-text>
            </div>
            <div *ngIf="this.subtitle2" class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{ this.subtitle2 | translate }} </ion-text>
            </div>
            <div *ngIf="this.description2" class="main__body__content__description">
              <ion-text class="ux-font-text-base">
                {{ this.description2 | translate  }}
              </ion-text>
            </div>
            <div *ngIf="this.subtitle3" class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{ this.subtitle3 | translate  }} </ion-text>
            </div>
            <div *ngIf="this.description3" class="main__body__content__description">
              <ion-text class="ux-font-text-base">
                {{ this.description3 | translate  }}
              </ion-text>
            </div>
            <div class="main__body__content__disclaimer" *ngIf="this.disclaimer">
              <ion-text class="ux-font-text-xxs">{{ this.disclaimer | translate }} </ion-text>
            </div>
            <div class="main__actions">
              <ion-button
                class="ux_button main__actions__button ion-no-margin"
                name="Understood"
                color="secondary"
                size="large"
                (click)="this.close()"
              >
                {{ this.buttonText  | translate}}
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
  subtitle3: string;
  description1: string;
  description2: string;
  description3: string;
  disclaimer: string;
  buttonText: string;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
