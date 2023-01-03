import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';

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
        <div
          class="ch__content__item"
          (click)="selectContact(contact.address)"
          lines="none"
          *ngFor="let contact of this.contacts"
        >
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
    private trackService: TrackService
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

  selectContact(address: string) {
    if (this.isSelecting) {
      this.trackContactSelected()
      this.navController.navigateBack([
        '/wallets/send/detail/blockchain',
        this.blockchain,
        'token',
        this.token,
        'address',
        address,
        'amount',
        this.amount,
      ]);
    }
  }

  trackContactSelected(){
    this.trackService.trackEvent({
      eventAction: 'click',
      description: window.location.href,
      eventLabel: 'ux_address_wallet'
    });
  }
}
