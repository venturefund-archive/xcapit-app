import { Component } from '@angular/core';
import { BwcService } from '../shared-wallets/services/bwc/bwc.service';
import { TokenOpts } from '../shared-wallets/constants/tokens';

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
      <ion-button (click)="this.getUserName()">Ver mi nombre</ion-button>
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
    this.bwcService.createSimpleWalletGroup(this.bwcService.getCoin('btc')).then((data) => {
      console.log('Wallet creada con éxito:');
      console.log(data);
      console.log(data.rootKey.toObj());
    });
  }

  createBTCAndETHWallet() {
    const coins = [];
    coins.push(this.bwcService.getCoin('btc'));
    coins.push(this.bwcService.getCoin('eth'));

    this.bwcService.createMultipleWallets(coins).subscribe((data) => {
      console.log('Wallets creadas con éxito:');
      this.ethWallet = data.wallets.find((wallet) => wallet.walletClient.credentials.coin.toLowerCase() === 'eth');
      console.log(data);
    });
  }

  createSharedBTCWallet() {
    this.bwcService.createSharedWallet(this.bwcService.getCoin('btc'), 4, 3).then((data) => {
      console.log('Wallet creada con éxito:');
      this.secret = data.wallets[0].secret;
      console.log(data);
    });
  }

  joinBTCWallet() {
    if (this.secret === undefined) {
      console.log('Primero crea una wallet compartida.');
    } else {
      this.bwcService.joinWallet(this.secret).then((data) => {
        console.log('Wallet creada con éxito:');
        console.log(data);
      });
    }
  }

  createTokenWalletBUSD() {
    if (this.ethWallet === undefined) {
      console.log('Primero crea una wallet ETH.');
    } else {
      const token = Object.values(TokenOpts).find((t) => t.symbol.toLowerCase() === 'busd');
      this.bwcService.createTokenWalletFromEthWallet(token, this.ethWallet).then((data) => {
        console.log('Wallet creada con éxito:');
        console.log(data);
      });
    }
  }

  getUserName() {
    this.bwcService.getUserName().subscribe((username) => {
      console.log(username);
    });
  }
}
