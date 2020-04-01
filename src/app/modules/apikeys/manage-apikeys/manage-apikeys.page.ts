import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ApikeyItemComponent } from '../components/apikey-item/apikey-item.component';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';

@Component({
  selector: 'app-manage-apikeys',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-buttons
          [routerLink]="['/apikeys/register']"
          slot="end"
          class="add-button "
        >
          <ion-icon style="zoom:2.25;" name="add"></ion-icon>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'apikeys.manage_apikeys.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <ion-list>
        <app-apikey-item
          *ngFor="let apikeys of apikeys"
          [nombre_bot]="this.apikeys.nombre_bot"
          [alias]="this.apikeys.alias"
        >
        </app-apikey-item>
      </ion-list>
      <!-- <div class="nr__image-container">
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
          </div> -->
    </ion-content>
  `,
  styleUrls: ['./manage-apikeys.page.scss'],
})
export class ManageApikeysPage implements OnInit {
  apikeys: any = [
    {
      nombre_bot: ' MultiUSDT',
      alias: 'binanceDLaura',
    },
    {
      nombre_bot: 'btc',
      alias: 'binanceDFede',
    },
  ];

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
