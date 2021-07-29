import { Component } from '@angular/core';
import { BwcService } from '../shared-wallets/services/bwc/bwc.service';
import { TokenOpts } from '../shared-wallets/constants/tokens';
import { WalletGroup } from '../shared-wallets/interfaces/wallet';
import { ApiProfilesService } from '../../profiles/shared-profiles/services/api-profiles/api-profiles.service';

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
      <div *ngIf="this.errorMsg">
        {{ this.errorMsg }}
      </div>
      <div>
        <ion-button style="width: 100%" (click)="this.createBTCWallet()">Crear nueva wallet BTC</ion-button>
      </div>
      <div>
        <ion-button style="width: 100%" (click)="this.createBTCAndETHAndDOGEWallet()"
          >Crear wallets BTC, DOGE y ETH de la misma seed</ion-button
        >
      </div>
      <div>
        <ion-button style="width: 100%" (click)="this.createSharedBTCWallet()"
          >Crear nueva wallet BTC compartida</ion-button
        >
      </div>
      <div>
        <ion-button style="width: 100%" (click)="this.joinBTCWallet()">Unirse a la wallet compartida</ion-button>
      </div>
      <div>
        <ion-button style="width: 100%" (click)="this.createTokenWalletBUSD()">Crear wallet de tokens BUSD</ion-button>
      </div>

      <div>
        <h3>Lista de wallets:</h3>
        <ion-card *ngFor="let walletGroup of wallets; let i = index" class="ion-padding">
          <ion-card-header
            ><ion-card-title
              ><b>Seed Nro. {{ i + 1 }}</b
              >:</ion-card-title
            ></ion-card-header
          >
          <ion-card-content>
            <p><b>Mnemónico</b>: {{ walletGroup.rootKey.toObj().mnemonic }}</p>
            <p><b>Llave privada extendida</b>: {{ walletGroup.rootKey.toObj().xPrivKey }}</p>
            <ion-card *ngFor="let wallet of walletGroup.wallets" class="ion-padding">
              <ion-card-header>
                <ion-card-title>{{ wallet.walletClient.credentials.walletName }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p><b>Moneda</b>: {{ wallet.walletClient.credentials.coin }}</p>
                <p><b>Nombre del peer</b>: {{ wallet.walletClient.credentials.copayerName }}</p>
                <p><b>BitPay ID</b>: {{ wallet.walletClient.credentials.walletId }}</p>
                <p><b>Cantidad de peers</b>: {{ wallet.walletClient.credentials.n }}</p>
                <p><b>Cantidad mínima de firmas</b>: {{ wallet.walletClient.credentials.m }}</p>
                <p><b>Red</b>: {{ wallet.walletClient.credentials.network }}</p>
              </ion-card-content>
            </ion-card>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./test-wallet.page.scss'],
})
export class TestWalletPage {
  ethWalletGroup: WalletGroup;
  secret: string;
  wallets: WalletGroup[];
  errorMsg: string;

  constructor(private bwcService: BwcService, private apiProfilesService: ApiProfilesService) {}

  ionViewWillEnter() {
    this.wallets = [];
    this.apiProfilesService.crud.get().subscribe((data) => {
      if (data.first_name) {
        this.bwcService.copayerName = data.first_name;
      } else {
        this.bwcService.copayerName = data.email;
      }
    });
  }

  createBTCWallet() {
    this.errorMsg = undefined;
    this.bwcService.createSimpleWalletGroup(this.bwcService.getCoin('btc'), true, false, 'testnet').then((data) => {
      this.wallets.push(data);
    });
  }

  createBTCAndETHAndDOGEWallet() {
    this.errorMsg = undefined;
    const coins = [];
    coins.push(this.bwcService.getCoin('btc'));
    coins.push(this.bwcService.getCoin('doge'));
    coins.push(this.bwcService.getCoin('eth'));

    this.bwcService.createMultipleWallets(coins, null, true).then((data) => {
      this.wallets.push(data);
      this.ethWalletGroup = data;
    });
  }

  createSharedBTCWallet() {
    this.errorMsg = undefined;
    this.bwcService.createSharedWallet(this.bwcService.getCoin('btc'), 4, 3, true, false, 'testnet').then((data) => {
      this.wallets.push(data);
      this.secret = data.wallets[0].secret;
    });
  }

  joinBTCWallet() {
    this.errorMsg = undefined;
    if (this.secret === undefined) {
      this.errorMsg = 'Primero crea una wallet compartida.';
    } else {
      this.bwcService.joinWallet(this.secret).then((data) => {
        this.wallets.push(data);
      });
    }
  }

  createTokenWalletBUSD() {
    this.errorMsg = undefined;
    if (this.ethWalletGroup === undefined) {
      this.errorMsg = 'Primero crea una wallet ETH.';
    } else {
      const token = Object.values(TokenOpts).find((t) => t.symbol.toLowerCase() === 'busd');
      const ethWallet = this.ethWalletGroup.wallets.find(
        (wallet) => wallet.walletClient.credentials.coin.toLowerCase() === 'eth'
      );
      this.bwcService.createTokenWalletFromEthWallet(token, ethWallet).then((data) => {
        this.ethWalletGroup.wallets.push(data);
      });
    }
  }
}
