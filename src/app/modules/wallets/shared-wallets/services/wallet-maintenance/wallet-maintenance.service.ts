import { Injectable } from '@angular/core';
import { Wallet } from 'ethers';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { Coin } from '../../interfaces/coin.interface';
import { StorageAsset } from '../../interfaces/storage-asset.interface';
import { StorageWallet } from '../../interfaces/storage-wallet.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { EthersService } from '../ethers/ethers.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';

@Injectable({
  providedIn: 'root',
})
export class WalletMaintenanceService {
  password: string;
  newNetworks: string[];
  encryptedWallet: StorageWallet;

  constructor(
    private apiWalletService: ApiWalletService,
    private walletEncryptionService: WalletEncryptionService,
    private storageService: StorageService,
    private ethersService: EthersService,
    private ionicStorageService: IonicStorageService
  ) {}

  async getEncryptedWalletFromStorage(): Promise<void> {
    this.encryptedWallet = await this.walletEncryptionService.getEncryptedWallet();
  }

  getNewNetworks() {
    this.newNetworks = this.apiWalletService.getWalletNewNetworks(this.encryptedWallet);
  }

  isUpdated(): boolean {
    this.getNewNetworks();
    if (this.newNetworks.length !== 0) {
      return false;
    }

    return true;
  }

  toggleAssets(changedAssets: StorageAsset[]) {
    changedAssets.forEach((asset) => this.toggleAsset(asset));
  }

  private toggleAsset(asset: StorageAsset) {
    if (this.userHasCoin(asset)) {
      this.removeCoinLocally(asset);
    } else {
      this.addCoinLocally(asset);
    }
  }

  addCoinLocally(asset: StorageAsset) {
    this.encryptedWallet.assets.push(asset);
  }

  private removeCoinLocally(asset: StorageAsset) {
    this.encryptedWallet.assets = this.encryptedWallet.assets.filter(
      (userAsset) => !(userAsset.value === asset.value && userAsset.network === asset.network)
    );
  }

  async updateTokensStorage(tokens: StorageAsset[]): Promise<void> {
    await this.getEncryptedWalletFromStorage();
    this.encryptedWallet.assets = tokens;
    return this.saveWalletToStorage();
  }

  async saveWalletToStorage(): Promise<void> {
    await this.storageService.saveWalletToStorage(this.encryptedWallet);
    this.wipeDataFromService();
  }

  async checkTokensStructure(): Promise<void> {
    const alreadyMigrated = await this.ionicStorageService.get('tokens_structure_migrated')
    if(!alreadyMigrated){
      await this.getEncryptedWalletFromStorage();
      if (this.encryptedWallet && !Array.isArray(this.encryptedWallet?.assets)) {
        const selectedAssets = Object.keys(this.encryptedWallet.assets).filter(
          (asset) => this.encryptedWallet.assets[asset]
        );
        const coins = this.apiWalletService.getCoins();
        this.encryptedWallet.assets = [];
        for (const asset of selectedAssets) {
          const { value, network } = coins.find((c) => c.value === asset);
          this.addCoinLocally({ value, network });
        }
        await this.ionicStorageService.set('tokens_structure_migrated', true);
        return this.saveWalletToStorage();
      }else{
        await this.ionicStorageService.set('tokens_structure_migrated', true);
      }
    }
  }

  wipeDataFromService() {
    this.encryptedWallet = undefined;
    this.newNetworks = undefined;
    this.password = undefined;
  }

  async getUserAssets(): Promise<Coin[]> {
    return this.storageService.getAssetsSelected();
  }

  userHasCoin(coin: Coin | StorageAsset): boolean {
    return this.encryptedWallet.assets.some(
      (userAsset) => userAsset.value === coin.value && userAsset.network === coin.network
    );
  }

  async addCoinIfUserDoesNotHaveIt(coin: Coin): Promise<void> {
    if (!this.encryptedWallet) {
      await this.getEncryptedWalletFromStorage();
    }

    if (!this.userHasCoin(coin)) {
      this.addCoinLocally(coin);
      await this.saveWalletToStorage();
    }

    this.wipeDataFromService();
  }
}
