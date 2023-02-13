import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { Contact } from '../shared-contacts/interfaces/contact.interface';
import { ContactDataService } from '../shared-contacts/services/contact-data/contact-data.service';

@Component({
  selector: 'app-contacts-home',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" (click)="this.back()"></ion-back-button>
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
        <div
          class="ch__content__item"
          (click)="this.select(contact)"
          lines="none"
          appTrackClick
          *ngFor="let contact of this.contacts"
        >
          <app-contact-item
            [name]="contact.name"
            [address]="contact.address"
            [networks]="contact.networks"
          ></app-contact-item>
        </div>
      </div>
    </ion-content>
    <ion-footer [class.hide]="this.isSelecting">
      <div class="ion-padding">
        <ion-button
          class="ux_button"
          appTrackClick
          (click)="create()"
          name="ux_address_new"
          color="secondary"
          expand="block"
        >
          {{ 'contacts.home.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./contacts-home.page.scss'],
})
export class ContactsHomePage implements OnInit {
  contacts = [];
  isSelecting = false;
  blockchain: string;
  token: string;
  amount: string;
  constructor(
    private ionicService: IonicStorageService,
    private navController: NavController,
    private route: ActivatedRoute,
    private trackService: TrackService,
    private contactDataService: ContactDataService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this._setMode();
    await this._getContacts();
  }

  private _setMode() {
    this.isSelecting = this.route.snapshot.paramMap.get('mode') === 'select';
    if (this.isSelecting) this._setData();
  }

  private _setData() {
    this.blockchain = this.route.snapshot.paramMap.get('blockchain');
    this.token = this.route.snapshot.paramMap.get('token');
    this.amount = this.route.snapshot.paramMap.get('amount');
  }

  private async _getContacts() {
    const contacts = await this.ionicService.get('contact_list');
    this.contacts = contacts ? contacts : [];
    if (this.blockchain) {
      this.contacts = this.contacts.filter((c) => c.networks.includes(this.blockchain));
    }
  }

  create() {
    this.navController.navigateForward(['/contacts/register']);
  }

  select(aContact: Contact) {
    if (this.isSelecting) {
      this.trackContactSelected();
      this.setEvent();
      this.contactDataService.updateContact(aContact);
      this.navController.navigateBack([
        '/wallets/send/detail/blockchain',
        this.blockchain,
        'token',
        this.token,
        'amount',
        this.amount,
      ]);
    } else {
      const contact: Contact = {
        name: aContact.name,
        address: aContact.address,
        networks: aContact.networks,
        index: this.contacts.indexOf(aContact),
      };
      this.contactDataService.updateContact(contact);
      this.navController.navigateForward('/contacts/detail');
    }
  }

  setEvent() {
    this.trackService.trackEvent({
      eventLabel: 'ux_address_select_wallet',
    });
  }

  trackContactSelected() {
    this.trackService.trackEvent({
      eventAction: 'click',
      description: window.location.href,
      eventLabel: 'ux_address_wallet',
    });
  }

  back() {
    if (this.isSelecting) {
      this.navController.navigateBack([
        '/wallets/send/detail/blockchain',
        this.blockchain,
        'token',
        this.token,
        'amount',
        this.amount,
      ]);
    } else {
      this.navController.navigateBack('/profiles/menu');
    }
  }
}
