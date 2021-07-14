import { Component } from '@angular/core';
import { Utils } from 'bitcore-wallet-client/ts_build/lib/common';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';
import { BitcoreLib } from 'crypto-wallet-core';
import * as _ from 'lodash';
import { BwcService } from '../shared-wallets/services/bwc/bwc.service';

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
      <ion-button (click)="this.createBTCWallet()">Crear nueva wallet BTC</ion-button>
      <ion-button (click)="this.createBTCAndETHWallet()">Crear nueva wallet BTC y una hija ETH</ion-button>
    </ion-content>
  `,
  styleUrls: ['./test-wallet.page.scss'],
})
export class TestWalletPage {
  client;
  key;

  constructor(private bwcSerivice: BwcService) {}
  clientText: string;

  ionViewWillEnter() {}

  createBTCWallet() {
    this.bwcSerivice.createSimpleWallet('btc').then((data) => {
      console.log(data.credentials, data.key.toObj());
    });
  }

  createBTCAndETHWallet() {
    this.bwcSerivice.createSimpleWallet('btc').then((data) => {
      this.bwcSerivice.createChildWallet(data.key.extendedPrivateKey, 'eth', 0).then((subdata) => {
        console.log(data.credentials, data.key.toObj());
        console.log(subdata.credentials, subdata.key.toObj());
      });
    });
  }
}
