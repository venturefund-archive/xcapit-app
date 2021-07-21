import { Injectable } from '@angular/core';
import BWC from 'bitcore-wallet-client';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';
import { Observable } from 'rxjs';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { Coin } from '../../interfaces/coin';
import { Token } from '../../interfaces/token';
import { Wallet, WalletGroup } from '../../interfaces/wallet';

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

  public createMultipleWallets(coins: Coin[], tokens?: Token[]): Observable<WalletGroup> {
    if (tokens !== undefined && coins.find((coin) => coin.symbol.toLowerCase() === 'eth') === undefined) {
      coins.push(this.getCoin('eth'));
    }

    return new Observable((observer) => {
      this.createSimpleWalletGroup(coins.pop()).subscribe((rootWalletGroup) => {
        this.createMultipleWalletsInGroup(coins, rootWalletGroup).subscribe((walletGroup) => {
          this.createMultipleTokenWalletsInGroup(tokens, walletGroup).subscribe((walletGroupWithTokens) => {
            observer.next(walletGroupWithTokens);
          });
        });
      });
    });
  }

  public createSimpleWalletGroup(
    coin: Coin,
    nativeSegWit?: boolean,
    singleAddress: boolean = false,
    network: string = 'livenet'
  ): Observable<WalletGroup> {
    const walletOptions = this.getDefaultWalletOptions(coin);

    walletOptions.nativeSegWit = coin.symbol.toLowerCase() === 'btc' ? nativeSegWit : false;
    walletOptions.singleAddress = singleAddress;
    walletOptions.network = network;

    return this.createWallet(walletOptions);
  }

  createMultipleWalletsInGroup(coins: Coin[], walletGroup: WalletGroup): Observable<WalletGroup> {
    const walletOptions: WalletOptions[] = [];

    coins.forEach((coin) => {
      walletOptions.push(this.getDefaultWalletOptions(coin, walletGroup));
    });

    return this.addNewWalletsToGroup(walletOptions, walletGroup);
  }

  public createSimpleWalletInGroup(coin: Coin, walletGroup: WalletGroup): Observable<WalletGroup> {
    const walletOptions = this.getDefaultWalletOptions(coin, walletGroup);

    return this.addNewWalletToGroup(walletOptions, walletGroup);
  }

  public createSimpleTokenWallet(token: Token, walletGroup: WalletGroup): Observable<WalletGroup> {
    const ethereumWallet = walletGroup.wallets.find(
      (wallet) => wallet.walletClient.credentials.coin.toLowerCase() === 'eth'
    );

    if (ethereumWallet === undefined) {
      const ethereum = this.getCoin('eth');
      const walletOptions = this.getDefaultWalletOptions(ethereum, walletGroup);
      this.addNewWalletToGroup(walletOptions, walletGroup);
    }

    return new Observable((observer) => {
      this.createTokenWallet(token, ethereumWallet).subscribe((tokenWallet) => {
        walletGroup.wallets.push(tokenWallet);
        observer.next(walletGroup);
      });
    });
  }

  public createMultipleTokenWalletsInGroup(tokens: Token[], walletGroup: WalletGroup): Observable<WalletGroup> {
    const ethereumWallet = walletGroup.wallets.find(
      (wallet) => wallet.walletClient.credentials.coin.toLowerCase() === 'eth'
    );

    if (ethereumWallet === undefined) {
      const ethereum = this.getCoin('eth');
      const walletOptions = this.getDefaultWalletOptions(ethereum, walletGroup);
      this.addNewWalletToGroup(walletOptions, walletGroup);
    }

    return new Observable((observer) => {
      tokens.forEach((token) => {
        this.createTokenWallet(token, ethereumWallet).subscribe((tokenWallet) => {
          walletGroup.wallets.push(tokenWallet);
          observer.next(walletGroup);
        });
      });
    });
  }

  public createSharedWallet(
    coin: Coin,
    totalCopayers: number,
    minimumSignsForTx: number,
    nativeSegWit?: boolean,
    singleAddress: boolean = false,
    network: string = 'livenet'
  ): Observable<WalletGroup> {
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

  private getDefaultWalletOptions(coin: Coin, walletGroup?: WalletGroup): WalletOptions {
    return {
      walletName: `${coin.name} Wallet`,
      copayerName: this.getUserName(),
      password: this.getUserPassword(),
      coin: coin.symbol.toLowerCase(),
      network: 'livenet',
      account: walletGroup ? this.getNextAccount(coin, walletGroup) : 0,
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

  private getNextAccount(coin: Coin, walletGroup: WalletGroup): number {
    const filteredWalletsAccounts = walletGroup.wallets
      .filter((wallet) => {
        return wallet.walletClient.credentials.coin.toLowerCase() === coin.symbol.toLowerCase();
      })
      .map((wallet) => parseInt(wallet.walletClient.credentials.account, 10));

    return Math.max(...filteredWalletsAccounts) + 1;
  }

  public joinWallet(secret: string): Observable<WalletGroup> {
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
        (error) => {
          if (!error) {
            observer.next({
              rootKey: key,
              wallets: [
                {
                  walletClient,
                  secret,
                },
              ],
            });
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
      observer.next({ walletClient, secret: ethereumWallet.secret });
    });
  }

  private addNewWalletsToGroup(walletOptions: WalletOptions[], walletGroup: WalletGroup): Observable<WalletGroup> {
    return new Observable((observer) => {
      walletOptions.forEach((wo) => this.addNewWalletToGroup(wo, walletGroup));

      observer.next(walletGroup);
    });
  }

  private addNewWalletToGroup(walletOptions: WalletOptions, walletGroup: WalletGroup): Observable<WalletGroup> {
    const walletClient = this.getClient();

    const credentials = walletGroup.rootKey.createCredentials(walletOptions.password, {
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
            walletGroup.wallets.push({ walletClient, secret });
            observer.next(walletGroup);
          }
        }
      );
    });
  }

  private createWallet(walletOptions: WalletOptions): Observable<WalletGroup> {
    const walletClient = this.getClient();

    const key = this.generateNewWalletSeed();

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
            observer.next({
              rootKey: key,
              wallets: [
                {
                  walletClient,
                  secret,
                },
              ],
            });
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
