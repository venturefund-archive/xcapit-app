import { Component } from '@angular/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TYC_ITEMS } from '../shared-users/constant/tyc-items';

@Component({
  selector: 'app-terms-and-conditions',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/menu"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'profiles.user_profile_menu.terms_and_conditions.tyc' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="tac">
      <div class="tac__card" *ngIf="this.xcapitItems">
        <app-tyc-item-card *ngFor="let item of this.xcapitItems" [item]="item" (openBrowser)="this.openBrowser($event)">
        </app-tyc-item-card>
      </div>
      <div class="tac__providers">
        <ion-text class="ux-font-header-titulo">{{
          'profiles.user_profile_menu.terms_and_conditions.providers' | translate
        }}</ion-text>
      </div>
      <div class="tac__card" *ngIf="this.providerItems">
        <app-tyc-item-card
          *ngFor="let item of this.providerItems"
          [item]="item"
          (openBrowser)="this.openBrowser($event)"
        >
        </app-tyc-item-card>
      </div>
    </ion-content> `,
  styleUrls: ['./terms-and-conditions.page.scss'],
})
export class TermsAndConditionsPage {
  items = structuredClone(TYC_ITEMS);
  xcapitItems = [];
  providerItems = [];

  constructor(private browserService: BrowserService, private ionicStorage: IonicStorageService) {}

  ionViewWillEnter() {
    this.filterItems();
  }

  async openBrowser(url: string) {
    await this.browserService.open({ url });
  }

  async filterItems() {
    this.xcapitItems = this.items.filter((item) => item.isXcapit);
    for (const item of this.items) {
      if (!item.isXcapit) {
        if (item.key) {
          const value = await this.ionicStorage.get(item.key);
          if (value) {
            this.providerItems.push(item);
          }
        } else {
          this.providerItems.push(item);
        }
      }
    }
  }
}
