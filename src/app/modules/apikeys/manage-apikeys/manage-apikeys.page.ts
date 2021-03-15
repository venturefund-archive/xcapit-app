import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { ApikeysEditModalComponent } from '../shared-apikeys/components/apikeys-edit-modal/apikeys-edit-modal.component';
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
    private modalController: ModalController,
    private apiApikeysService: ApiApikeysService
  ) {}

  ngOnInit() {}

  ionViewWillLeave() {}

  removeApikey(notificationId: any) {
    this.apiApikeysService.crud.delete;
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ApikeysEditModalComponent,
      componentProps: {
        data: this.apikeys[0]
      },
      cssClass: 'ux-routeroutlet-modal apikeys-modal',
      swipeToClose: false
    });

    modal.present();
  }
}
