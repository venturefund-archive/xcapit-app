import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IMPORT_ITEM_METHOD } from '../../shared-wallets/constants/import-item-method';

@Component({
  selector: 'app-wallet-imports',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref=""></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.wallet_imports.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="wi">
      <div class="wi__title">
        <ion-text class="ux-font-text-lg">{{ 'wallets.wallet_imports.title' | translate }}</ion-text>
      </div>
      <div class="wi__subtitle">
        <ion-text class="ux-font-text-base">{{ 'wallets.wallet_imports.subtitle' | translate }}</ion-text>
      </div>
      <div class="wi__method">
        <app-import-method-options *ngFor="let method of methods" [method]="method" (route)="this.navigateTo($event)">
        </app-import-method-options>
      </div>
      <div class="wi__support">
        <ion-text class="ux-link-xs" (click)="goToFaqs()">{{ 'wallets.wallet_imports.support' | translate }}</ion-text>
      </div>
    </ion-content>`,
  styleUrls: ['./wallet-imports.page.scss'],
})
export class WalletImportsPage {
  methods = structuredClone(IMPORT_ITEM_METHOD);
  constructor(private navController: NavController) {}

  navigateTo(route: string) {
    this.navController.navigateForward(route);
  }

  goToFaqs() {
    this.navController.navigateForward('/support/faqs/wallet');
  }
}
