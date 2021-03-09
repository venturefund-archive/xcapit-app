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
        <ion-button color="uxprimary" slot="end">
          <ion-icon defaultHref="/apikeys/register" name="add-sharp"></ion-icon>
        </ion-button>
        <ion-title class="ion-text-center">{{
          'apikeys.apikeys_list.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
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
