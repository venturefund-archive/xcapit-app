import { Injectable } from '@angular/core';
import BWC from 'bitcore-wallet-client';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';
import { LanguageService } from 'src/app/shared/services/language/language.service';

const BWS_INSTANCE_URL = 'https://bws.bitpay.com/bws/api';

enum GenerationType {
  NEW,
  EXTENDED_PRIVATE_KEY,
  MNEMONIC,
}

interface WalletData {
  password: string;
  coin: string;
  network: string;
  account: number;
  maximumCopayers: number;
  minimumSignsForTx: number;
  name: string;
  copayerName: string;
  generationType: GenerationType;
  generationData?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BwcService {
  public Client = BWC;
  clientInstance: BWC;

  constructor(private languageService: LanguageService) {}

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

  createSharedWallet(coin: string, maximumCopayers: number, minimumSignsForTx: number): Promise<any> {
    const walletData: WalletData = {
      password: 'test',
      coin,
      account: 0,
      network: 'testnet',
      maximumCopayers,
      minimumSignsForTx,
      name: `${coin.toUpperCase()} Shared Wallet`,
      copayerName: 'Federico',
      generationType: GenerationType.NEW,
    };

    return this.createWallet(walletData);
  }

  createSimpleWallet(coin: string): Promise<any> {
    const walletData: WalletData = {
      password: 'test',
      coin,
      account: 0,
      network: 'testnet',
      maximumCopayers: 1,
      minimumSignsForTx: 1,
      name: `${coin.toUpperCase()} Wallet`,
      copayerName: 'Federico',
      generationType: GenerationType.NEW,
    };

    return this.createWallet(walletData);
  }

  joinWallet(secret: string, password?: string, copayerName?: string): Promise<any> {
    this.clientInstance = this.getClient();

    const walletData = BWC.parseSecret(secret);

    const key = this.generateWalletSeed(GenerationType.NEW);

    const credentials = key.createCredentials(password, {
      coin: walletData.coin,
      network: walletData.network,
      account: 0,
      n: 2,
    });

    this.clientInstance.fromString(credentials);

    return new Promise((resolve) => {
      this.clientInstance.joinWallet(
        secret,
        copayerName,
        {
          coin: this.clientInstance.credentials.coin,
        },
        (err, wallet) => {
          if (err) {
            console.log('error: ', err);
            return;
          } else {
            console.log('Wallet creada con éxito:');
            return resolve({ credentials, key, wallet });
          }
        }
      );
    });
  }

  createChildWallet(parentKey: Key, coin: string): Promise<any> {
    const walletData: WalletData = {
      password: 'test',
      coin,
      account: 0,
      network: 'testnet',
      maximumCopayers: 1,
      minimumSignsForTx: 1,
      name: `${coin.toUpperCase()} Wallet`,
      copayerName: 'Federico',
      generationType: GenerationType.NEW,
    };

    return this.createWallet(walletData, parentKey);
  }

  createTokenWallet() {}

  private createWallet(walletData: WalletData, parentKey?: Key): Promise<any> {
    this.clientInstance = this.getClient();

    let key;

    if (parentKey !== undefined) {
      key = parentKey;
    } else {
      key = this.generateWalletSeed(walletData.generationType, walletData.generationData);
    }

    const credentials = key.createCredentials(walletData.password, {
      coin: walletData.coin,
      network: walletData.network || 'testnet',
      account: walletData.account,
      n: walletData.maximumCopayers,
    });

    credentials.m = walletData.minimumSignsForTx;

    this.clientInstance.fromString(credentials);

    return new Promise((resolve) => {
      this.clientInstance.createWallet(
        walletData.name,
        walletData.copayerName,
        this.clientInstance.credentials.m,
        this.clientInstance.credentials.n,
        {
          coin: this.clientInstance.credentials.coin,
          network: this.clientInstance.credentials.network,
          singleAddress: false,
          useNativeSegwit: true,
          walletPrivKey: this.clientInstance.credentials.walletPrivKey,
        },
        (err, secret) => {
          if (err) {
            console.log('error: ', err);
            return;
          } else {
            console.log('Wallet creada con éxito:');
            return resolve({ credentials, key, secret });
          }
        }
      );
    });
  }

  private generateWalletSeed(generationType: GenerationType, data?: string): Key {
    const keyData = {
      seedType: null,
      seedData: null,
      language: null,
      useLegacyCoinType: false,
      useLegacyPurpose: false,
    };

    switch (generationType) {
      case GenerationType.NEW:
        keyData.seedType = 'new';
        keyData.language = this.languageService.selected;
        break;
      case GenerationType.MNEMONIC:
        keyData.seedType = 'mnemonic';
        keyData.seedData = data;
        break;
      case GenerationType.EXTENDED_PRIVATE_KEY:
        keyData.seedType = 'extendedPrivateKey';
        keyData.seedData = data;
        break;
    }

    return new Key(keyData);
  }
}
