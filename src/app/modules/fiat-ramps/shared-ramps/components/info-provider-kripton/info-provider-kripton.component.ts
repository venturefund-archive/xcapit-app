import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-provider-kripton',
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
              <ion-text class="ux-font-text-xl">{{ this.title }} </ion-text>
            </div>

          <!-- Parte generica (titulo y logo) -->
            <div class="ux-font-header-titulo main__body__content__header">
            <ion-text>{{'fiat_ramps.select_provider.modal_info.kripton.header' | translate}}</ion-text>
            <ion-text>{{'fiat_ramps.select_provider.modal_info.kyc_required' | translate}}</ion-text>
            </div>
            <div class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{'fiat_ramps.select_provider.modal_info.subtitle_minimum_amount' | translate}}</ion-text>
            </div>
            <div class="main__body__content__description">
              <ion-text class="ux-font-text-base">
                {{ 'fiat_ramps.select_provider.modal_info.kripton.minimum_amount' | translate}}
              </ion-text>
            </div>
            <div class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{'fiat_ramps.select_provider.modal_info.subtitle_delivery_time' | translate}}</ion-text>
            </div>
            <div class="main__body__content__description">
              <ul>
              <ion-text class="ux-font-text-base">
                {{ 'fiat_ramps.select_provider.modal_info.kripton.delivery_time_1' | translate}}
              </ion-text>
              <ion-text class="ux-font-text-base">
                {{ 'fiat_ramps.select_provider.modal_info.kripton.delivery_time_2' | translate}}
              </ion-text>
              </ul>
            </div>
            <div class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{'fiat_ramps.select_provider.modal_info.subtitle_more_information' | translate}}</ion-text>
            </div>
            <div class="main__body__content__description">
              <ion-text class="ux-font-text-base">
                {{ 'fiat_ramps.select_provider.modal_info.kripton.more_information' | translate}}
              </ion-text>
            </div>
            <!-- <div class="main__body__content__disclaimer" *ngIf="this.disclaimer">
              <ion-text class="ux-font-text-xxs">{{ this.disclaimer }} </ion-text>
            </div> -->
            <div class="main__actions">
              <ion-button
                class="ux_button main__actions__button ion-no-margin"
                name="Understood"
                color="secondary"
                size="large"
                (click)="this.close()"
              >
                {{ 'fiat_ramps.select_provider.modal_info.button' | translate }}
              </ion-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./info-provider-kripton.component.scss'],
})
export class InfoProviderKriptonComponent implements OnInit {
  image: string;
  title: string;
  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

}
