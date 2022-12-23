import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Component({
  selector: 'app-contacts-home',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/menu"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'contacts.home.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ch">
      <div class="ch__empty-content" *ngIf="this.contacts.length === 0">
        <img class="ch__empty-content__img" src="/assets/img/contacts/empty.svg" />
        <div class="ch__empty-content__text">
          <ion-text class="ux-font-text-xs ch__empty-content__text__title">{{
            'contacts.home.empty.title' | translate
          }}</ion-text>
          <ion-text class="ux-font-text-xs ch__empty-content__text__subtitle">{{
            'contacts.home.empty.subtitle' | translate
          }}</ion-text>
        </div>
      </div>
      <div class="ch__content" *ngIf="this.contacts.length > 0">
        <div class="ch__content__item" lines="none" *ngFor="let contact of this.contacts">
          <div class="ch__content__item__wrapper">
            <img class="ch__content__item__wrapper__img" src="/assets/img/contacts/wallet.svg" />
            <div class="ch__content__item__wrapper__data">
              <div class="ch__content__item__wrapper__data__title">
                <ion-text class="ux-font-text-lg">{{ contact.name }}</ion-text>
                <app-token-network-badge
                  *ngIf="contact.networks.length === 1"
                  [blockchainName]="contact.networks[0]"
                ></app-token-network-badge>
              </div>
              <div class="ch__content__item__wrapper__data__networks" *ngIf="contact.networks.length > 1">
                <app-token-network-badge
                  *ngFor="let network of contact.networks"
                  [blockchainName]="network"
                ></app-token-network-badge>
              </div>
              <div class="ch__content__item__wrapper__data__subtitle">
                <ion-text class="ux-font-text-xs">{{ contact.address }}</ion-text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
    <ion-footer>
      <div class="ion-padding">
        <ion-button class="ux_button" appTrackClick (click)="create()" name="ux_address_new" color="secondary" expand="block">
          {{ 'contacts.home.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./contacts-home.page.scss'],
})
export class ContactsHomePage implements OnInit {
  contacts = [];
  constructor(private ionicService: IonicStorageService, private navController: NavController) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this._getContacts();
  }

  async _getContacts() {
    const contacts = await this.ionicService.get('contact_list')
    this.contacts = contacts ? contacts : [];
  }
  
  create(){
    this.navController.navigateForward(['/contacts/register'])
  }
}
