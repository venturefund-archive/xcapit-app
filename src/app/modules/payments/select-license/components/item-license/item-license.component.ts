import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-license',
  template: ` <div class="ilc">
    <div class="ilc__content">
      <div *ngIf="this.license.type == 'premium'" class="image">
        <img src="../assets/ux-icons/ux-corone.png" alt="premium logo" />
      </div>
      <div
        *ngIf="this.license.type == 'free' || this.license.type == 'paid'"
        class="ilc__content__name ux-font-gilroy ux-fweight-bold ux-fsize-14 "
      >
        <input class="input_radio" type="radio" name="select" id="select" value="select" />
        <label class="ilc__content__name__license" for="select">{{ this.license.name }}</label>
      </div>
      <div
        *ngIf="this.license.type == 'premium'"
        class="ilc__content__name ux-font-gilroy ux-fweight-bold ux-fsize-14 "
      >
        <label class="ilc__content__name__premium" for="select">{{ this.license.name }}</label>
      </div>
      <div class="ilc__content__description">
        <div class="ux-font-lato ux-fweight-regular ux-fsize-14">
          <ion-text class="info_text">{{ this.license.info }}</ion-text>
        </div>
      </div>
      <div *ngIf="this.license.type == 'free' || this.license.type == 'paid'" class="ilc__content__price">
        <div>
          <ion-text class="license_text ux-font-gilroy ux-fweight-bold ux-fsize-15" color="uxdark">{{
            this.license.price
          }}</ion-text>
          <ion-text
            class="ux-font-lato ux-fweight-regular ux-fsize-12"
            *ngIf="this.license.type == 'paid' && this.license.state == 'anual'"
            class="name_text"
            >/anual</ion-text
          >
          <ion-text
            class="ux-font-lato ux-fweight-regular ux-fsize-12"
            *ngIf="this.license.type == 'paid' && this.license.state == 'mensual'"
            class="name_text"
            >/mensual</ion-text
          >
        </div>
      </div>
      <div *ngIf="this.license.type == 'premium'">
        <ion-button
          class="ilc__content__button ux-fweight-bold ux-fsize-14"
          name="Contact Us"
          appTrackClick
          fill="clear"
          size="small"
          >Contáctanos</ion-button
        >
      </div>
    </div>
  </div>`,
  styleUrls: ['./item-license.component.scss'],
})
export class ItemLicenseComponent implements OnInit {
  @Input() license: any;

  constructor() {}

  ngOnInit() {}
}
