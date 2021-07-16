import { Injectable } from '@angular/core';
import BWC from 'bitcore-wallet-client';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';
import { LanguageService } from 'src/app/shared/services/language/language.service';

const BWS_INSTANCE_URL = 'https://bws.bitpay.com/bws/api';

export interface Token {
  name: string;
  symbol: string;
  decimal: number;
  address: string;
}

export const TokenOpts = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
    name: 'USD Coin',
    symbol: 'USDC',
    decimal: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  '0x8e870d67f660d95d5be530380d0ec0bd388289e1': {
    name: 'Paxos Standard',
    symbol: 'PAX',
    decimal: 18,
    address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
  },
  '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': {
    name: 'Gemini Dollar',
    symbol: 'GUSD',
    decimal: 2,
    address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
  },
  '0x4fabb145d64652a948d72533023f6e7a623c7c53': {
    name: 'Binance USD Coin',
    symbol: 'BUSD',
    decimal: 18,
    address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
  },
  '0x6b175474e89094c44da98b954eedeac495271d0f': {
    name: 'Dai',
    symbol: 'DAI',
    decimal: 18,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimal: 9,
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  },
};

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
            return resolve({ walletClient: this.clientInstance, key, wallet });
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

  createTokenWallet(ethWallet: any, token: string): Promise<any> {
    const tokenObj = Object.values(TokenOpts).find((t) => t.symbol === token);
    const tokenCredentials = ethWallet.walletClient.credentials.getTokenCredentials(tokenObj);

    this.clientInstance = this.getClient();

    this.clientInstance.fromObj(tokenCredentials);

    ethWallet.preferences = ethWallet.preferences || {};
    ethWallet.preferences.tokenAddresses = ethWallet.preferences.tokenAddresses || [];
    ethWallet.preferences.tokenAddresses.push(tokenObj.address);

    return Promise.resolve(this.clientInstance);
  }

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
            return resolve({ walletClient: this.clientInstance, key, secret });
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
