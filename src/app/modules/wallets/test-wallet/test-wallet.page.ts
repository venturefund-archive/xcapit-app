import { Component, OnInit } from '@angular/core';
import { BwcService } from '../shared-wallets/services/bwc/bwc.service';
import _ from 'lodash';

@Component({
  selector: 'app-test-wallet',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/success"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'apikeys.insert_key.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button (click)="this.createWallet()">Crear nueva wallet</ion-button>
    </ion-content>
  `,
  styleUrls: ['./test-wallet.page.scss'],
})
export class TestWalletPage implements OnInit {
  constructor(private bwcService: BwcService) {}

  ngOnInit() {}

  createWallet() {
    this.bwcService.generateFirstWallets();
  }
}
