import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-basic-information',
  template: ` <div class="ubi__card__personal-data ux-border-card ion-padding">
    <div class="ubi__card__personal-data__edit">
      <div class="title">
        <ion-text class="ux-font-titulo-xs">{{
          'fiat_ramps.kyc.summary_data.personal_data.label_name_surname' | translate
        }}</ion-text>
      </div>
      <div class="ubi__card__personal-data__edit__edit-button">
        <ion-button
          appTrackClick
          name="ux_edit_user_basic"
          class="ion-no-margin"
          fill="clear"
          size="small"
          (click)="this.goToUserBasicEdit()"
        >
          <ion-icon icon="edit"></ion-icon>
        </ion-button>
      </div>
    </div>
    <div class="description">
      <ion-text class="ux-font-text-base">{{ this.firstName + ' ' + this.lastName }}</ion-text>
    </div>
    <div class="title">
      <ion-text class="ux-font-titulo-xs">{{
        'fiat_ramps.kyc.summary_data.personal_data.label_birthday' | translate
      }}</ion-text>
    </div>
    <div class="description last">
      <ion-text class="ux-font-text-base">{{ this.birthday }}</ion-text>
    </div>
  </div>`,
  styleUrls: ['./user-basic-information.component.scss'],
})
export class UserBasicInformationComponent implements OnInit {
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() birthday: string;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToUserBasicEdit() {
    this.navController.navigateBack('fiat-ramps/user-basic');
  }
}
