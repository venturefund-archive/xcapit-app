import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import * as moment from 'moment';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { Coin } from '../../interfaces/coin.interface';
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
  allCoins = [];
  coins: Coin[];
  constructor(private appStorageService: AppStorageService, private apiWalletService: ApiWalletService) {}

  async getWalletFromStorage() {
    return await this.appStorageService.get('enc_wallet');
  }

  async saveWalletToStorage(wallet: any) {
    return await this.appStorageService.set('enc_wallet', wallet);
  }

  async removeWalletFromStorage(){
    return await this.appStorageService.remove('enc_wallet');
  }

  async getWalletsAddresses(network: string = null) {
    const wallets = await this.getWalletFromStorage();

    if (network) {
      return wallets.addresses[network];
    }

    return wallets.addresses;
  }

  async getAssestsSelected() {
    this.coins = this.apiWalletService.getCoins();
    const wallets = await this.getWalletFromStorage();
    let userCoins = [];
    this.allCoins = this.coins;

    if (!!wallets && !!wallets.assets) {
      userCoins = this.allCoins.filter((coin) => wallets.assets[coin.value]);
    }
    return userCoins;
  }

  async saveAssetSelected(asset: any) {
    const wallets = await this.getWalletFromStorage();

    if (!!wallets && !!wallets.assets[asset]) {
      wallets.assets[asset] = !wallets.assets[asset];
      wallets.updatedAt = moment().utc().format();

      return await this.saveWalletToStorage(wallets);
    }

    return false;
  }

  async updateAssetsList() {
    this.coins = this.apiWalletService.getCoins();
    const wallets = await this.getWalletFromStorage();
    let updated = false;

    if (wallets) {
      if (wallets.assets) {
        for (const coin of this.coins) {
          if (wallets.assets[coin.value] === undefined) {
            wallets.assets[coin.value] = false;
            updated = true;
          }
        }
      } else {
        const selectedCoins = {};

        for (const coin of this.coins) {
          selectedCoins[coin.value] = true;
        }

        wallets.assets = selectedCoins;
        updated = true;
      }

      if (updated) {
        wallets.updatedAt = moment().utc().format();
        return await this.saveWalletToStorage(wallets);
      } else {
        return false;
      }
    }
  }
}
