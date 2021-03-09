import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';

@Component({
  selector: 'app-manage-apikeys',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-buttons [routerLink]="['/apikeys/register']" slot="end" class="nr__add-button" >
          <ion-icon class="icon"style="zoom:6.0;" name="add-sharp"></ion-icon>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'apikeys.manage_apikeys.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
      <ion-content class="ion-padding-top">
        <div class="nr__image-container">
          <img
            class="nr__image-container__image"
            src="assets/img/apikeys/no-apikey.svg"
            alt="no-apikey"
          />
        </div>
        <div class="nr__subtitle ion-padding-start ion-padding-end">
          <ion-text
            class="ux-font-lato ux-fweight-regular ux-fsize-15"
            color="uxsemidark"
          >
            {{ 'apikeys.manage_apikeys.subtitle' | translate }}
          </ion-text>
        </div>
      </ion-content>
  `,
  styleUrls: ['./manage-apikeys.page.scss'],
})
export class ManageApikeysPage implements OnInit {
  apikeys: any;

  constructor(
    private navController: NavController,
    private apiApikeysService: ApiApikeysService
  ) {}

  ngOnInit() {}

  ionViewWillLeave() {}

  removeApikey(notificationId: any) {
    this.apiApikeysService.crud.delete;
  }
}
