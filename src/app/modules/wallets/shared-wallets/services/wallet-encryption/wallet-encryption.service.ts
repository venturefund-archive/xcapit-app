import { Injectable } from '@angular/core';
import { Wallet } from 'ethers';
import { WalletService } from '../wallet/wallet.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';

@Injectable({
  providedIn: 'root',
})
export class WalletEncryptionService {
  private ethWallet: any = null;
  private walletsAddresses = {};
  private selectedCoins = {};
  coins: Coin[];

  constructor(
    private walletService: WalletService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService
  ) {
    this.coins = this.apiWalletService.getCoins();
  }

  encryptWallet(password: string): Promise<any> {
    const wallets = this.walletService.createdWallets;
    const derivedPaths = environment.derivedPaths;

    wallets.forEach((wallet) => {
      if (wallet.mnemonic.path === derivedPaths.ERC20) {
        this.ethWallet = wallet;
      }

      const key = Object.keys(derivedPaths).filter((keyName) => derivedPaths[keyName] === wallet.mnemonic.path);
      const value = wallet.address;

      this.walletsAddresses[key[0]] = value;
    });
    return this.saveEncryptedWallet(password);
  }

  private saveEncryptedWallet(password: string): Promise<any> {
    return new Promise<any>(async (resolve) => {
      this.ethWallet.encrypt(password).then(async (wallet) => {
        const structure = this.storageStructure(wallet);
        await this.storageService.saveWalletToStorage(structure);

        resolve(true);
      });
    });
  }

  getDecryptedWallet(password: string): Promise<any> {
    return this.storageService.getWalletFromStorage().then((res) => Wallet.fromEncryptedJsonSync(res.wallet, password));
  }

  getDecryptedWalletForCurrency(password: string, currency: Coin): Promise<Wallet> {
    return this.getDecryptedWallet(password).then((wallet) => {
      return Wallet.fromMnemonic(wallet.mnemonic.phrase, environment.derivedPaths[currency.network]);
    });
  }

  getEncryptedWallet(): Promise<any> {
    return this.storageService.getWalletFromStorage();
  }

  selectedAssetsStructure() {
    const userCoins = this.walletService.coins;
    this.selectedCoins = {};

    for (const coin of this.coins) {
      const key = coin.value;
      const value = userCoins.includes(coin);

      this.selectedCoins[key] = value;
    }

    return this.selectedCoins;
  }

  private storageStructure(encWallet) {
    return {
      alias: this.ethWallet.address,
      wallet: encWallet,
      createdAt: moment().utc().format(),
      updatedAt: moment().utc().format(),
      addresses: this.walletsAddresses,
      network: environment.walletNetwork,
      assets: this.selectedAssetsStructure(),
    };
  }

  async encryptedWalletExist(): Promise<boolean> {
    return !!(await this.storageService.getWalletFromStorage());
  }
}
