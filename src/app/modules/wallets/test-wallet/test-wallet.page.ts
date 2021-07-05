import { Component, OnInit } from '@angular/core';
import { BwcService } from '../shared-wallets/services/bwc/bwc.service';
import _ from 'lodash';
import { BitcoreLib } from 'crypto-wallet-core';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';
import { Utils } from 'bitcore-wallet-client/ts_build/lib/common';

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
    const client = this.bwcService.getClient();
    const key = new Key({
      seedType: 'new',
      useLegacyCoinType: false,
      useLegacyPurpose: false,
    });
    const credentials = key.createCredentials('test', {
      coin: 'btc',
      network: 'testnet',
      account: 0,
      n: 1,
      m: 1,
    });
    credentials.m = 1;
    client.fromString(credentials);

    const hash = Utils.hashMessage('asdasdasdaasifauyhsuihriw');
    const priv = new BitcoreLib.PrivateKey(credentials.walletPrivKey);
    const sign = BitcoreLib.crypto.ECDSA.sign(hash, priv, 'little');

    console.log(sign.toString());

    // // Creamos el cliente usando getClient()
    // const client = this.bwcService.getClient();

    // // Creamos una nueva Key donde le indicamos
    // // a la wallet que vamos a generar una nueva seed
    // const key = new Key({
    //   seedType: 'new',
    //   useLegacyCoinType: false,
    //   useLegacyPurpose: false,
    // });

    // // Creamos un nuevo conjunto de credenciales con
    // // nombre 'test', para monedas BitCoin en la red
    // // de pruebas, para un único peer (n=1, m=1)
    // const credentials = key.createCredentials('test', {
    //   coin: 'btc',
    //   network: 'testnet',
    //   account: 0,
    //   n: 1,
    //   m: 1,
    // });

    // credentials.m = 1;

    // // Creamos un nuevo cliente a partir de las credenciales
    // client.fromString(credentials);

    // // Creamos la wallet usando client.createWallet()
    // // Los parámetros son: nombre de la wallet, nombre
    // // del peer, m, n, opciones avanzadas y callback
    // client.createWallet(
    //   'Test Wallet',
    //   'Alice',
    //   client.credentials.m,
    //   client.credentials.n,
    //   {
    //     coin: client.credentials.coin,
    //     network: client.credentials.network,
    //     singleAddress: false,
    //     useNativeSegwit: true,
    //     walletPrivKey: client.credentials.walletPrivKey,
    //   },
    //   (err) => {
    //     if (err) {
    //       // Si hubo un error, imprimirlo
    //       console.log('error: ', err);
    //       return;
    //     } else {
    //       // Si se creó la wallet, imprimir los datos
    //       // de la misma
    //       console.log('Wallet creada con éxito:');
    //       console.log(client);
    //       console.log(key);
    //     }
    //   }
    // );
  }
}
