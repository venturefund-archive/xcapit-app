import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { WalletService } from '../wallet/wallet.service';
import { StorageService } from '../../services/storage-wallets/storage-wallets.service';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import { COINS } from '../../../constants/coins';

@Injectable({
  providedIn: 'root',
})
export class WalletEncryptionService {
  private ethWallet: any = null;
  private walletsAddresses = {};
  private selectedCoins = {};
  coins = COINS;

  constructor(private walletService: WalletService, private storageService: StorageService) {}

  encryptWallet(password: string): Promise<any> {
    const wallets = this.walletService.createdWallets;
    const derivedPaths = environment.derivedPaths;

    wallets.forEach((wallet) => {
      if (wallet.mnemonic.path === derivedPaths.ETH) {
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
    return new Promise<any>(async (resolve) => {
      const storageWallet = await this.storageService.getWalletFromStorage();

      const res = ethers.Wallet.fromEncryptedJsonSync(storageWallet.wallet, password);

      resolve(res);
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
