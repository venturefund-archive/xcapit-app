import { Component } from '@angular/core';
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
      <ion-button (click)="this.createSharedBTCWallet()">Crear nueva wallet BTC compartida</ion-button>
      <ion-button (click)="this.joinBTCWallet()">Unirse a la wallet compartida</ion-button>
      <ion-button (click)="this.createTokenWalletBUSD()">Crear wallet de tokens BUSD</ion-button>
    </ion-content>
  `,
  styleUrls: ['./test-wallet.page.scss'],
})
export class TestWalletPage {
  client;
  ethWallet;
  key;

  constructor(private bwcService: BwcService) {}
  secret: string;

  ionViewWillEnter() {}

  createBTCWallet() {
    this.bwcService.createSimpleWallet('btc').then((data) => {
      console.log('Wallet creada con éxito:');
      console.log(data.walletClient, data.key.toObj());
    });
  }

  createBTCAndETHWallet() {
    this.bwcService.createSimpleWallet('btc').then((data) => {
      console.log('Wallet padre creada con éxito:');
      console.log(data.walletClient, data.key.toObj());
      this.bwcService.createChildWallet(data.key, 'eth').then((subdata) => {
        console.log('Wallet hija creada con éxito:');
        this.ethWallet = { walletClient: subdata.walletClient, key: subdata.key };
        console.log(subdata.walletClient, subdata.key.toObj());
      });
    });
  }

  createSharedBTCWallet() {
    this.bwcService.createSharedWallet('btc', 4, 3).then((data) => {
      console.log('Wallet creada con éxito:');
      this.secret = data.secret;
      console.log(data.walletClient, data.key.toObj(), data.secret);
    });
  }

  joinBTCWallet() {
    if (this.secret === undefined) {
      console.log('Primero crea una wallet compartida.');
    } else {
      this.bwcService.joinWallet(this.secret, 'test', 'Victoria').then((data) => {
        console.log('Wallet creada con éxito:');
        console.log(data.walletClient, data.key.toObj(), data.wallet);
      });
    }
  }

  createTokenWalletBUSD() {
    if (this.ethWallet === undefined) {
      console.log('Primero crea una wallet ETH.');
    } else {
      this.bwcService.createTokenWallet(this.ethWallet, 'BUSD').then((data) => {
        console.log('Wallet creada con éxito:');
        console.log(data);
      });
    }
  }
}
