import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import * as moment from 'moment';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { Coin } from '../../interfaces/coin.interface';
import { StorageWallet } from '../../interfaces/storage-wallet.interface';
@Injectable({
  providedIn: 'root',
})
export class StorageWalletsService {
  constructor(private storage: Storage) {}

  async setValue(key: string, value: any): Promise<void> {
    return this.storage.set(key, value);
  }

  async getValue(key: string): Promise<any> {
    return this.storage.get(key);
  }

  async hasAcceptedToS(): Promise<boolean> {
    return new Promise((resolve) => {
      this.getValue('userAcceptedToS').then((v) => resolve(v === true));
    });
  }

  async acceptToS(): Promise<void> {
    return this.setValue('userAcceptedToS', true);
  }
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  coins: Coin[];
  constructor(private appStorageService: AppStorageService, private apiWalletService: ApiWalletService) {}

  async getWalletFromStorage(): Promise<StorageWallet> {
    return await this.appStorageService.get('enc_wallet');
  }

  async saveWalletToStorage(wallet: StorageWallet) {
    const walletData = await this.getWalletFromStorage() || {};
    return await this.appStorageService.set('enc_wallet', { ...walletData, ...wallet });
  }

  async removeWalletFromStorage() {
    return await this.appStorageService.remove('enc_wallet');
  }

  async getWalletsAddresses(network: string = null) {
    const wallets = await this.getWalletFromStorage();

    if (network) {
      return wallets.addresses[network];
    }

    return wallets.addresses;
  }

  async getAssetsSelected(): Promise<Coin[]> {
    this.coins = this.apiWalletService.getCoins();
    const wallets = await this.getWalletFromStorage();
    let userCoins = [];

    if (wallets) {
      userCoins = this.coins.filter(coin => {
        return wallets.assets.find(userCoin => coin.value === userCoin.value && coin.network === userCoin.network);
      });
    }
    return userCoins;
  }
}
