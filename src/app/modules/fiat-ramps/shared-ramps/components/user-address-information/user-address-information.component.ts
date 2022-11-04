import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-address-information',
  template: ` <div class="uai__card__personal-data ux-border-card ion-padding">
    <div class="uai__card__personal-data__edit">
      <div class="title">
        <ion-text class="ux-font-titulo-xs">{{
          'fiat_ramps.kyc.summary_data.address_data.label_street' | translate
        }}</ion-text>
      </div>
      <div class="uai__card__personal-data__edit__edit-button">
        <ion-button
          appTrackClick
          name="ux_edit_user_address"
          class="ion-no-margin"
          fill="clear"
          size="small"
          (click)="this.goToUserAddressEdit()"
        >
          <ion-icon icon="edit"></ion-icon>
        </ion-button>
      </div>
    </div>

    <div class="description">
      <ion-text class="ux-font-text-base">{{ this.street }}</ion-text>
    </div>
    <div class="apartment">
      <div class="apartment__number">
        <div class="title">
          <ion-text class="ux-font-titulo-xs">{{
            'fiat_ramps.kyc.summary_data.address_data.label_apartment_number' | translate
          }}</ion-text>
        </div>
        <div class="description">
          <ion-text class="ux-font-text-base">{{ this.number }}</ion-text>
        </div>
      </div>
      <div class="apartment__floor">
        <div class="title">
          <ion-text class="ux-font-titulo-xs">{{
            'fiat_ramps.kyc.summary_data.address_data.label_apartment_floor' | translate
          }}</ion-text>
        </div>
        <div class="description">
          <ion-text class="ux-font-text-base">{{ this.floor ? this.floor : '-' }}</ion-text>
        </div>
      </div>
      <div class="apartment__letter">
        <div class="title">
          <ion-text class="ux-font-titulo-xs">{{
            'fiat_ramps.kyc.summary_data.address_data.label_apartment_letter' | translate
          }}</ion-text>
        </div>
        <div class="description">
          <ion-text class="ux-font-text-base">{{ this.apartment ? this.apartment : '-' }}</ion-text>
        </div>
      </div>
    </div>
    <div class="title">
      <ion-text class="ux-font-titulo-xs">{{
        'fiat_ramps.kyc.summary_data.address_data.label_city' | translate
      }}</ion-text>
    </div>
    <div class="description">
      <ion-text class="ux-font-text-base">{{ this.city }}</ion-text>
    </div>
    <div class="title">
      <ion-text class="ux-font-titulo-xs">{{
        'fiat_ramps.kyc.summary_data.address_data.label_zip_code' | translate
      }}</ion-text>
    </div>
    <div class="description last">
      <ion-text class="ux-font-text-base">{{ this.zipCode }}</ion-text>
    </div>
  </div>`,
  styleUrls: ['./user-address-information.component.scss'],
})
export class UserAddressInformationComponent implements OnInit {
  @Input() street: string;
  @Input() number: string;
  @Input() floor: string;
  @Input() apartment: string;
  @Input() city: string;
  @Input() zipCode: string;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToUserAddressEdit() {
    this.navController.navigateBack('fiat-ramps/user-address');
  }
}
