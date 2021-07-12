import { Injectable } from '@angular/core';
import BWC from 'bitcore-wallet-client';

const BWS_INSTANCE_URL = 'https://bws.bitpay.com/bws/api';

@Injectable({
  providedIn: 'root',
})
export class BwcService {
  public Client = BWC;
  clientInstance: BWC;

  constructor() {}

  public getClient(walletData?, opts?): BWC {
    opts = opts || {};

    const bwc = new BWC({
      baseUrl: opts.bwsurl || BWS_INSTANCE_URL,
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling'],
      bp_partner: opts.bp_partner,
      bp_partner_version: opts.bp_partner_version,
    });

    if (walletData) bwc.fromString(walletData);
    return bwc;
  }

  public generateFirstWallets() {
    // Creamos el cliente usando getClient()
    this.clientInstance = this.getClient();

    // Creamos una nueva Key donde le indicamos
    // a la wallet que vamos a generar una nueva seed
    const key = new BWC.Key({
      seedType: 'new',
      useLegacyCoinType: false,
      useLegacyPurpose: false,
    });

    // Creamos un nuevo conjunto de credenciales con
    // nombre 'test', para monedas BitCoin en la red
    // de pruebas, para un único peer (n=1, m=1)
    const credentials = key.createCredentials('test', {
      coin: 'btc',
      network: 'testnet',
      account: 0,
      n: 1,
      m: 1,
    });

    credentials.m = 1;

    // Creamos un nuevo cliente a partir de las credenciales
    this.clientInstance.fromString(credentials);

    // Creamos la wallet usando client.createWallet()
    // Los parámetros son: nombre de la wallet, nombre
    // del peer, m, n, opciones avanzadas y callback
    this.clientInstance.createWallet(
      'Test Wallet',
      'Alice',
      this.clientInstance.credentials.m,
      this.clientInstance.credentials.n,
      {
        coin: this.clientInstance.credentials.coin,
        network: this.clientInstance.credentials.network,
        singleAddress: false,
        useNativeSegwit: true,
        walletPrivKey: this.clientInstance.credentials.walletPrivKey,
      },
      (err) => {
        if (err) {
          // Si hubo un error, imprimirlo
          console.log('error: ', err);
          return;
        } else {
          // Si se creó la wallet, imprimir los datos
          // de la misma
          console.log('Wallet creada con éxito:');
          console.log(this.clientInstance);
          console.log(key);
        }
      }
    );
  }
}
