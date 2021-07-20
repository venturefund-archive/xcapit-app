import { Injectable } from '@angular/core';
import BWC from 'bitcore-wallet-client';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';
import { Observable } from 'rxjs';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { Coin } from '../../interfaces/coin';
import { Token } from '../../interfaces/token';
import { Wallet } from '../../interfaces/wallet';

const BWS_INSTANCE_URL = 'https://bws.bitpay.com/bws/api';

enum SeedType {
  NEW,
  EXTENDED_PRIVATE_KEY,
  MNEMONIC,
}
interface Seed {
  seedType: SeedType;
  extendedPrivateKey?: string;
  mnemonic?: string;
}
interface WalletOptions {
  walletName: string;
  copayerName: string;
  password: string;
  coin: string;
  network: string;
  account: number;
  totalCopayers: number;
  minimumSignsForTx: number;
  singleAddress: boolean;
  nativeSegWit: boolean;
  seed: Seed;
}
@Injectable({
  providedIn: 'root',
})
export class BwcService {
  public Client = BWC;

  constructor(private languageService: LanguageService) {}

  public createMultipleWallets(coins: Coin[], tokens?: Token[]): Observable<Wallet[]> {
    if (tokens !== undefined && coins.find((coin) => coin.symbol.toLowerCase() === 'eth') === undefined) {
      return;
    }

    const wallets: Wallet[] = [];
    let mainWallet: Wallet;
    let ethereumWallet: Wallet;

    return new Observable((observer) => {
      coins.forEach((coin, i) => {
        if (i === 0) {
          this.createSimpleWallet(coin).subscribe((wallet) => {
            mainWallet = wallet;
            wallets.push(wallet);
          });
        } else {
          this.createSimpleWalletFromKey(coin, mainWallet.rootKey).subscribe((wallet) => {
            wallets.push(wallet);

            if (coin.symbol.toLowerCase() === 'eth') {
              ethereumWallet = wallet;
            }
          });
        }
      });

      tokens.forEach((token) => {
        this.createSimpleTokenWallet(token, ethereumWallet).subscribe((wallet) => {
          wallets.push(wallet);
        });
      });

      observer.next(wallets);
    });
  }

  public createSimpleWallet(
    coin: Coin,
    nativeSegWit?: boolean,
    singleAddress: boolean = false,
    network: string = 'livenet'
  ): Observable<Wallet> {
    const walletOptions = this.getDefaultWalletOptions(coin);

    walletOptions.nativeSegWit = coin.symbol.toLowerCase() === 'btc' ? nativeSegWit : false;
    walletOptions.singleAddress = singleAddress;
    walletOptions.network = network;

    return this.createWallet(walletOptions);
  }

  public createSimpleWalletFromKey(coin: Coin, rootKey: Key): Observable<Wallet> {
    const walletOptions = this.getDefaultWalletOptions(coin);

    return this.createWallet(walletOptions, rootKey);
  }

  public createSimpleTokenWallet(token: Token, ethereumWallet?: Wallet): Observable<Wallet> {
    if (ethereumWallet === undefined) {
      const ethereum = this.getCoin('eth');

      this.createSimpleWallet(ethereum).subscribe((wallet) => {
        ethereumWallet = wallet;
      });
    }

    return this.createTokenWallet(token, ethereumWallet);
  }

  public createSharedWallet(
    coin: Coin,
    totalCopayers: number,
    minimumSignsForTx: number,
    nativeSegWit?: boolean,
    singleAddress: boolean = false,
    network: string = 'livenet'
  ): Observable<Wallet> {
    const walletOptions = this.getDefaultWalletOptions(coin);

    walletOptions.totalCopayers = totalCopayers;
    walletOptions.minimumSignsForTx = minimumSignsForTx;
    walletOptions.nativeSegWit = coin.symbol.toLowerCase() === 'btc' ? nativeSegWit : false;
    walletOptions.singleAddress = singleAddress;
    walletOptions.network = network;

    return this.createWallet(walletOptions);
  }

  private getClient(walletData?, opts?): BWC {
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

  private getCoin(symbol: string): Coin {
    return {
      id: 0,
      name: 'Ethereum',
      symbol: 'ETH',
      logoRoute: '',
    };
  }

  private getDefaultWalletOptions(coin: Coin): WalletOptions {
    return {
      walletName: `${coin.name} Wallet`,
      copayerName: this.getUserName(),
      password: this.getUserPassword(),
      coin: coin.symbol.toLowerCase(),
      network: 'livenet',
      account: this.getNextAccount(coin),
      totalCopayers: 1,
      minimumSignsForTx: 1,
      singleAddress: false,
      nativeSegWit: coin.symbol.toLowerCase() === 'btc' ? true : false,
      seed: {
        seedType: SeedType.NEW,
      },
    };
  }

  private getUserPassword(): string {
    return 'test';
  }

  private getUserName(): string {
    return 'Federico Marquez';
  }

  private getNextAccount(coin: Coin): number {
    return 0;
  }

  public joinWallet(secret: string): Observable<Wallet> {
    const password = this.getUserPassword();
    const copayerName = this.getUserName();
    const walletClient = this.getClient();

    const walletData = BWC.parseSecret(secret);

    const key = this.generateWalletSeed(SeedType.NEW);

    const credentials = key.createCredentials(password, {
      coin: walletData.coin,
      network: walletData.network,
      account: 0,
      n: 2,
    });

    walletClient.fromString(credentials);

    return new Observable((observer) => {
      walletClient.joinWallet(
        secret,
        copayerName,
        {
          coin: walletClient.credentials.coin,
        },
        (error, wallet) => {
          if (!error) {
            return observer.next({ walletClient, rootKey: key, secret: '' });
          }
        }
      );
    });
  }

  private createTokenWallet(token: Token, ethereumWallet: Wallet): Observable<Wallet> {
    const tokenCredentials = ethereumWallet.walletClient.credentials.getTokenCredentials(token);

    const walletClient = this.getClient();

    walletClient.fromObj(tokenCredentials);

    ethereumWallet.preferences = ethereumWallet.preferences || {};
    ethereumWallet.preferences.tokenAddresses = ethereumWallet.preferences.tokenAddresses || [];
    ethereumWallet.preferences.tokenAddresses.push(token.address);

    return new Observable((observer) => {
      observer.next({ walletClient, rootKey: ethereumWallet.rootKey, secret: ethereumWallet.secret });
    });
  }

  private createWallet(walletOptions: WalletOptions, parentKey?: Key): Observable<Wallet> {
    const walletClient = this.getClient();

    let key;

    if (parentKey !== undefined) {
      key = parentKey;
    } else {
      const seedData = walletOptions.seed.extendedPrivateKey
        ? walletOptions.seed.extendedPrivateKey
        : walletOptions.seed.mnemonic;
      key = this.generateWalletSeed(walletOptions.seed.seedType, seedData);
    }

    const credentials = key.createCredentials(walletOptions.password, {
      coin: walletOptions.coin,
      network: walletOptions.network,
      account: walletOptions.account,
      n: walletOptions.totalCopayers,
    });

    credentials.m = walletOptions.minimumSignsForTx;

    walletClient.fromString(credentials);

    return new Observable((observer) => {
      walletClient.createWallet(
        walletOptions.walletName,
        walletOptions.copayerName,
        walletOptions.minimumSignsForTx,
        walletOptions.totalCopayers,
        {
          coin: walletOptions.coin,
          network: walletOptions.network,
          singleAddress: walletOptions.singleAddress,
          useNativeSegwit: walletOptions.nativeSegWit,
          walletPrivKey: walletClient.credentials.walletPrivKey,
        },
        (err, secret) => {
          if (!err) {
            return observer.next({ walletClient, rootKey: key, secret });
          }
        }
      );
    });
  }

  private generateNewWalletSeed(): Key {
    return new Key({
      seedType: 'new',
      language: this.languageService.selected,
      useLegacyCoinType: false,
      useLegacyPurpose: false,
    });
  }

  private generateWalletSeedFromMnemonic(mnemonic: string): Key {
    return new Key({
      seedType: 'mnemonic',
      seedData: mnemonic,
      useLegacyCoinType: false,
      useLegacyPurpose: false,
    });
  }

  private generateWalletSeedFromPrivateKey(extendedPrivateKey: string): Key {
    return new Key({
      seedType: 'extendedPrivateKey',
      seedData: extendedPrivateKey,
      useLegacyCoinType: false,
      useLegacyPurpose: false,
    });
  }

  private generateWalletSeed(generationType: SeedType, data?: string): Key {
    switch (generationType) {
      case SeedType.NEW:
        return this.generateNewWalletSeed();
      case SeedType.MNEMONIC:
        return this.generateWalletSeedFromMnemonic(data);
      case SeedType.EXTENDED_PRIVATE_KEY:
        return this.generateWalletSeedFromPrivateKey(data);
    }
  }
}
