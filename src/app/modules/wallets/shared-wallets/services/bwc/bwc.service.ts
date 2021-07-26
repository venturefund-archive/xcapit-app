import { Injectable } from '@angular/core';
import BWC from 'bitcore-wallet-client';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';
import { Observable } from 'rxjs';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { Coin } from '../../interfaces/coin';
import { Token } from '../../interfaces/token';
import { Coins } from '../../constants/coins';
import { Wallet, WalletGroup } from '../../interfaces/wallet';
import { ApiProfilesService } from 'src/app/modules/profiles/shared-profiles/services/api-profiles/api-profiles.service';

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
  bwsInstanceUrl = 'https://bws.bitpay.com/bws/api';
  copayerName: string;
  password: string;
  public Client = BWC;

  constructor(private languageService: LanguageService, private apiProfilesService: ApiProfilesService) {
    this.getUserName().subscribe((userName) => {
      this.copayerName = userName;
    });
  }

  public createMultipleWallets(coins: Coin[], tokens?: Token[]): Observable<WalletGroup> {
    if (tokens !== undefined && coins.find((coin) => coin.symbol.toLowerCase() === 'eth') === undefined) {
      coins.push(this.getCoin('eth'));
    }

    return new Observable((observer) => {
      this.createSimpleWalletGroup(coins.pop()).then((rootWalletGroup) => {
        this.createMultipleWalletsInGroup(coins, rootWalletGroup).then((walletGroup) => {
          if (tokens) {
            this.createMultipleTokenWalletsInGroup(tokens, walletGroup).subscribe((walletGroupWithTokens) => {
              observer.next(walletGroupWithTokens);
            });
          }
        });
      });
    });
  }

  public createSimpleWalletGroup(
    coin: Coin,
    nativeSegWit?: boolean,
    singleAddress: boolean = false,
    network: string = 'livenet'
  ): Promise<WalletGroup> {
    const walletOptions = this.getDefaultWalletOptions(coin);

    walletOptions.nativeSegWit = coin.symbol.toLowerCase() === 'btc' ? nativeSegWit : false;
    walletOptions.singleAddress = singleAddress;
    walletOptions.network = network;

    return this.createWalletAndGroup(walletOptions);
  }

  createMultipleWalletsInGroup(coins: Coin[], walletGroup: WalletGroup): Promise<WalletGroup> {
    const walletOptions: WalletOptions[] = [];

    coins.forEach((coin) => {
      walletOptions.push(this.getDefaultWalletOptions(coin, walletGroup));
    });

    return this.createMultipleWalletsAndAddToGroup(walletOptions, walletGroup);
  }

  public createSimpleWalletInGroup(coin: Coin, walletGroup: WalletGroup): Promise<WalletGroup> {
    const walletOptions = this.getDefaultWalletOptions(coin, walletGroup);

    return this.createWalletAndAddToGroup(walletOptions, walletGroup);
  }

  public createSimpleTokenWallet(token: Token, walletGroup: WalletGroup): Observable<WalletGroup> {
    const ethereumWallet = walletGroup.wallets.find(
      (wallet) => wallet.walletClient.credentials.coin.toLowerCase() === 'eth'
    );

    if (ethereumWallet === undefined) {
      const ethereum = this.getCoin('eth');
      const walletOptions = this.getDefaultWalletOptions(ethereum, walletGroup);
      this.createWalletAndAddToGroup(walletOptions, walletGroup);
    }

    return new Observable((observer) => {
      this.createTokenWalletFromEthWallet(token, ethereumWallet).then((tokenWallet) => {
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
      this.createWalletAndAddToGroup(walletOptions, walletGroup);
    }

    return new Observable((observer) => {
      tokens.forEach((token) => {
        this.createTokenWalletFromEthWallet(token, ethereumWallet).then((tokenWallet) => {
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
  ): Promise<WalletGroup> {
    const walletOptions = this.getDefaultWalletOptions(coin);

    walletOptions.totalCopayers = totalCopayers;
    walletOptions.minimumSignsForTx = minimumSignsForTx;
    walletOptions.nativeSegWit = coin.symbol.toLowerCase() === 'btc' ? nativeSegWit : false;
    walletOptions.singleAddress = singleAddress;
    walletOptions.network = network;

    return this.createWalletAndGroup(walletOptions);
  }

  getClient(walletData?, opts?): BWC {
    opts = opts || {};

    const bwc = new BWC({
      baseUrl: opts.bwsurl || this.bwsInstanceUrl,
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling'],
      bp_partner: opts.bp_partner,
      bp_partner_version: opts.bp_partner_version,
    });

    if (walletData) bwc.fromString(walletData);
    return bwc;
  }

  getCoin(symbol: string): Coin {
    return Coins.find((coin) => coin.symbol.toLowerCase() === symbol.toLowerCase());
  }

  getDefaultWalletOptions(coin: Coin, walletGroup?: WalletGroup): WalletOptions {
    return {
      walletName: `${coin.name} Wallet`,
      copayerName: this.copayerName,
      password: this.password,
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

  getUserName(): Observable<string> {
    return new Observable<string>((observer) => {
      this.apiProfilesService.crud.get().subscribe((data) => {
        if (data.first_name) {
          observer.next(data.first_name);
        } else {
          observer.next(data.email);
        }
      });
    });
  }

  getNextAccount(coin: Coin, walletGroup: WalletGroup): number {
    const filteredWalletsAccounts = walletGroup.wallets
      .filter((wallet) => {
        return wallet.walletClient.credentials.coin.toLowerCase() === coin.symbol.toLowerCase();
      })
      .map((wallet) => parseInt(wallet.walletClient.credentials.account, 10));

    if (filteredWalletsAccounts.length === 0) {
      return 0;
    }

    return Math.max(...filteredWalletsAccounts) + 1;
  }

  public joinWallet(secret: string): Promise<WalletGroup> {
    const password = this.password;
    const copayerName = this.copayerName;
    const walletClient = this.getClient();

    const walletData = this.Client.parseSecret(secret);

    const key = this.generateNewWalletSeed();

    const credentials = key.createCredentials(password, {
      coin: walletData.coin,
      network: walletData.network,
      account: 0,
      n: 2,
    });

    walletClient.fromString(credentials);

    return new Promise((resolve) => {
      walletClient.joinWallet(
        secret,
        copayerName,
        {
          coin: walletData.coin,
        },
        (error) => {
          if (!error) {
            resolve({
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

  createTokenWalletFromEthWallet(token: Token, ethereumWallet: Wallet): Promise<Wallet> {
    const tokenCredentials = ethereumWallet.walletClient.credentials.getTokenCredentials(token);

    const walletClient = this.getClient();

    walletClient.fromObj(tokenCredentials);

    ethereumWallet.preferences = ethereumWallet.preferences || {};
    ethereumWallet.preferences.tokenAddresses = ethereumWallet.preferences.tokenAddresses || [];
    ethereumWallet.preferences.tokenAddresses.push(token.address);

    return new Promise((resolve) => {
      resolve({ walletClient, secret: ethereumWallet.secret });
    });
  }

  createMultipleWalletsAndAddToGroup(walletOptions: WalletOptions[], walletGroup: WalletGroup): Promise<WalletGroup> {
    return new Promise((resolve) => {
      walletOptions.forEach((wo) => this.createWalletAndAddToGroup(wo, walletGroup));

      resolve(walletGroup);
    });
  }

  createWalletAndAddToGroup(walletOptions: WalletOptions, walletGroup: WalletGroup): Promise<WalletGroup> {
    return new Promise((resolve) => {
      this.createWalletFromKey(walletOptions, walletGroup.rootKey).then((wallet) => {
        walletGroup.wallets.push(wallet);
        resolve(walletGroup);
      });
    });
  }

  createWalletFromKey(walletOptions: WalletOptions, rootKey: Key): Promise<Wallet> {
    const walletClient = this.getClient();

    const credentials = rootKey.createCredentials(walletOptions.password, {
      coin: walletOptions.coin,
      network: walletOptions.network,
      account: walletOptions.account,
      n: walletOptions.totalCopayers,
    });

    credentials.m = walletOptions.minimumSignsForTx;

    walletClient.fromString(credentials);

    return new Promise((resolve) => {
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
            resolve({ walletClient, secret });
          }
        }
      );
    });
  }

  createWalletAndGroup(walletOptions: WalletOptions): Promise<WalletGroup> {
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

    return new Promise((resolve) => {
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
            resolve({
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

  private generateWalletSeedFromMnemonic(mnemonic: string, passphrase: string): Key {
    return new Key({
      seedType: 'mnemonic',
      seedData: mnemonic,
      language: this.languageService.selected,
      passphrase,
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
}
