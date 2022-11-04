import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-personal-information',
  template: ` <div class="upi__card__personal-data ux-border-card ion-padding">
    <div class="upi__card__personal-data__edit">
      <div class="title">
        <ion-text class="ux-font-titulo-xs">{{
          'fiat_ramps.kyc.summary_data.personal_data.label_nationality' | translate
        }}</ion-text>
      </div>
      <div class="upi__card__personal-data__edit__edit-button">
        <ion-button
          appTrackClick
          name="ux_edit_personal_information"
          class="ion-no-margin"
          fill="clear"
          size="small"
          (click)="this.goToUserPersonalInformationEdit()"
        >
          <ion-icon icon="edit"></ion-icon>
        </ion-button>
      </div>
    </div>

    <div class="description">
      <ion-text class="ux-font-text-base">{{ this.nationality.name }}</ion-text>
    </div>
    <div class="title">
      <ion-text class="ux-font-titulo-xs">{{
        'fiat_ramps.kyc.summary_data.personal_data.label_document' | translate
      }}</ion-text>
    </div>
    <div class="description">
      <ion-text class="ux-font-text-base">{{ this.documentNumber }}</ion-text>
    </div>
    <div class="title">
      <ion-text class="ux-font-titulo-xs">{{
        'fiat_ramps.kyc.summary_data.personal_data.label_gender' | translate
      }}</ion-text>
    </div>
    <div class="description">
      <ion-text class="ux-font-text-base">{{ this.gender.value | translate }}</ion-text>
    </div>
    <div class="title">
      <ion-text class="ux-font-titulo-xs">{{
        'fiat_ramps.kyc.summary_data.personal_data.label_marital_status' | translate
      }}</ion-text>
    </div>
    <div class="description">
      <ion-text class="ux-font-text-base">{{ this.maritalStatus.value | translate }}</ion-text>
    </div>
    <div class="title">
      <ion-text class="ux-font-titulo-xs">{{
        'fiat_ramps.kyc.summary_data.personal_data.label_phone' | translate
      }}</ion-text>
    </div>
    <div class="description last">
      <ion-text class="ux-font-text-base">{{ this.countryCode + this.phoneNumber }}</ion-text>
    </div>
  </div>`,
  styleUrls: ['./user-personal-information.component.scss'],
})
export class UserPersonalInformationComponent implements OnInit {
  @Input() nationality;
  @Input() documentNumber;
  @Input() gender;
  @Input() maritalStatus;
  @Input() countryCode;
  @Input() phoneNumber;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToUserPersonalInformationEdit() {
    this.navController.navigateBack('fiat-ramps/user-personal-information');
  }
}
