import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-toast-alert',
  template: `
    <div style="clear: both;overflow: hidden;" class="pcc_content" [ngClass]="[this.typeAlert.style]">
      <div class="pcc_content__important">
        <div class="pcc_content__important__image">
          <img class="pcc_content__important__image__img" [src]="this.typeAlert.img" alt="Toast Logo" />
        </div>
        <div class="pcc_content__important__title ">
          <div class="ux-font-text-xs">
            <ion-text class="text">{{ this.typeAlert.title }}</ion-text>
          </div>
        </div>
        <div
          *ngIf="this.typeAlert === this.types.error || this.typeAlert === this.types.success"
          class="pcc_content__important__button"
        >
          <ion-button appTrackClick name="Select" fill="clear" size="big" slot="end" (click)="this.close()">
            <ion-icon class="pcc_content__important__button__button_color" slot="end" name="close"></ion-icon>
          </ion-button>
        </div>
      </div>
      <div
        *ngIf="this.typeAlert === this.types.error_v3 || this.typeAlert === this.types.atention"
        class="pcc_content__message"
      >
        <div class="ux-font-text-xs">
          <ion-text class="text" color="uxdark"> {{ this.typeAlert.message }}</ion-text>
        </div>
      </div>
      <div *ngIf="this.typeAlert === this.types.information_update" class="pcc_content__information">
        <div class="pcc_content__details_link" *ngIf="this.detailsEnabled">
          <ion-button
            class="pcc_content__details_link__link"
            name="Go To Help"
            (click)="this.seeDetails()"
            appTrackClick
            fill="clear"
            size="small"
            >{{ 'Detalles' }}
            <ion-icon class="pcc_content__details_link__link__icon" name="arrow-forward-outline"></ion-icon
          ></ion-button>
        </div>
      </div>
      <div *ngIf="this.typeAlert === this.types.items_error" class="ux-font-text-xs pcc_content__items">
        <ul class="text" style="list-style-type:disc">
          <li>{{ this.types.items_error.item1 }}</li>
          <li [hidden]="this.types.items_error.item2 == null">{{ this.types.items_error.item2 }}</li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./toast-alert.component.scss'],
})
export class ToastAlertComponent implements OnInit {
  @Input() title: string;
  @Input() type: string;
  @Input() message: string;
  @Input() item1: string;
  @Input() item2: string;
  @Input() detailsEnabled = true;

  typeAlert;

  types = {
    error: {
      title: '',
      message: '',
      style: 'style-error',
      img: '../assets/img/alerts/error.svg',
    },
    success: {
      title: '',
      message: '',
      style: 'style-success',
      img: '../assets/img/alerts/success.svg',
    },

    atention: {
      title: '',
      message: '',
      style: 'style-atention',
      img: '../assets/img/alerts/atention.svg',
    },

    information_update: {
      title: '',
      style: 'style-information',
      img: ' ../assets/img/alerts/information.svg',
    },

    items_error: {
      title: '',
      item1: '',
      item2: '',
      message: '',
      style: 'style-items-error',
      img: '../assets/img/alerts/error.svg',
    },

    error_v3: {
      title: '',
      message: '',
      style: 'style-errorv3',
      img: '../assets/img/alerts/error.svg',
    },
  };

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.getTypeAlert(this.type);
    this.setAlertValues();
  }

  close() {
    this.modalController.dismiss();
  }

  seeDetails() {
    this.close();
  }

  getTypeAlert(type: string) {
    switch (type) {
      case 'error': {
        return (this.typeAlert = this.types.error);
      }
      case 'success': {
        return (this.typeAlert = this.types.success);
      }
      case 'atention': {
        return (this.typeAlert = this.types.atention);
      }
      case 'information': {
        return (this.typeAlert = this.types.information_update);
      }
      case 'error-item': {
        return (this.typeAlert = this.types.items_error);
      }
      case 'errorv3': {
        return (this.typeAlert = this.types.error_v3);
      }
    }
  }

  setAlertValues() {
    this.typeAlert.title = this.title;
    this.typeAlert.message = this.message;
    this.typeAlert.item1 = this.item1;
    this.typeAlert.item2 = this.item2;
  }
}
