import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TwoButtonsAlertComponent } from 'src/app/shared/components/two-buttons-alert/two-buttons-alert.component';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { Contact } from '../shared-contacts/interfaces/contact.interface';
import { ContactDataService } from '../shared-contacts/services/contact-data/contact-data.service';

@Component({
  selector: 'app-contact-detail',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/contacts/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'contacts.detail.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="cd ion-padding">
      <div class="cd__content ion-padding" *ngIf="this.contact">
        <div class="cd__content__wrapper">
          <img class="cd__content__wrapper__img" src="/assets/img/contacts/wallet.svg" />
          <div class="cd__content__wrapper__icons">
            <div class="cd__content__wrapper__icons__edit" (click)="this.edit(contact)">
              <ion-icon name="ux-edit-info"></ion-icon>
            </div>
            <div class="cd__content__wrapper__icons__delete" (click)="this.showDeleteAlert()">
              <ion-icon name="ux-delete-info"></ion-icon>
            </div>
          </div>
        </div>
        <div class="cd__content__title">
          <ion-text class="ux-font-text-lg">{{ this.contact.name }}</ion-text>
        </div>
        <div class="cd__content__networks">
          <ion-text class="ux-font-titulo-xs">{{ 'contacts.detail.subtitle_network' | translate }}</ion-text>
          <div class="cd__content__networks__item">
            <app-token-network-badge
              *ngFor="let network of this.contact.networks"
              [blockchainName]="network"
            ></app-token-network-badge>
          </div>
        </div>
        <div class="cd__content__address-wrapper">
          <ion-text class="ux-font-titulo-xs">{{ 'contacts.detail.subtitle_address' | translate }}</ion-text>
          <div class="cd__content__address-wrapper__address">
            <ion-text class="ux-font-text-xs">{{ this.contact.address }}</ion-text>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./contact-detail.page.scss'],
})
export class ContactDetailPage {
  contact: Contact;
  contacts = [];

  constructor(
    private ionicService: IonicStorageService,
    private navController: NavController,
    private translate: TranslateService,
    private modalController: ModalController,
    private contactDataService: ContactDataService
  ) {}

  async ionViewWillEnter() {
    this.getContactDetail();
    await this.getContactsList();
  }

  getContactDetail() {
    this.contact = this.contactDataService.getContact();
  }

  private async getContactsList() {
    this.contacts = await this.ionicService.get('contact_list');
  }

  async deleteContact() {
    this.contacts = this.contacts.filter((contact) => contact.address !== this.contact.address);
    await this.ionicService.set('contact_list', this.contacts);
    this.navigateToContactHome();
  }

  edit(aContact : Contact) {
    const contact: Contact = {
      name: aContact.name,
      address: aContact.address,
      networks: aContact.networks,
      index: aContact.index,
    };
    this.contactDataService.updateContact(contact);
    this.navController.navigateForward('/contacts/register/edit');
  }

  navigateToContactHome() {
    this.navController.navigateForward('/contacts/home');
  }

  async showDeleteAlert() {
    const modal = await this.modalController.create({
      component: TwoButtonsAlertComponent,
      cssClass: 'modal',
      backdropDismiss: false,
      componentProps: {
        title: this.translate.instant('contacts.detail.alert.title'),
        description: this.translate.instant('contacts.detail.alert.description'),
        confirmButton: this.translate.instant('contacts.detail.alert.confirm_button'),
        cancelButton: this.translate.instant('contacts.detail.alert.cancel_button'),
      },
    });

    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      await this.deleteContact();
    }
  }
}
