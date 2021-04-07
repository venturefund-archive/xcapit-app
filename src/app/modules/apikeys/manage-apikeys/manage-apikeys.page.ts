import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';

@Component({
  selector: 'app-manage-apikeys',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button
            appTrackClick
            name="RegisterNewKey"
            class="add-button"
            (click)="createApiKey()"
          >
            <ion-icon style="zoom:1.5;" name="add"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'apikeys.manage_apikeys.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div *ngIf="!showImage">
        <ion-list>
          <app-apikey-item
            *ngFor="let apikeys of apikeys"
            [id]="this.apikeys.id"
            [nombre_bot]="this.apikeys.nombre_bot"
            [alias]="this.apikeys.alias"
          >
          </app-apikey-item>
        </ion-list>
      </div>

      <div *ngIf="showImage">
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
      </div>
    </ion-content>
  `,
  styleUrls: ['./manage-apikeys.page.scss'],
})
export class ManageApikeysPage implements OnInit {
  apikeys: any = [];
  showImage: boolean = false;
  loading: boolean = true;

  constructor(
    private apiApikeysService: ApiApikeysService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getAllApiKeys();
  }

  createApiKey() {
    this.navController.navigateForward('/apikeys/register');
  }

  getAllApiKeys() {
    this.apiApikeysService.getAll().subscribe((data) => {
      this.apikeys = data;
      this.showImage = this.apikeys.length === 0;
    });
  }
}
