import { Injectable } from '@angular/core';
import { Wallet } from 'ethers';
import moment from 'moment';
import { environment } from 'variables.env';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { EthersService } from '../ethers/ethers.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable({
  providedIn: 'root',
})
export class WalletMaintenanceService {
  password: string;
  newNetworks: string[];
  encryptedWallet: any;
  private _wallet: Wallet;

  private get wallet(): Wallet {
    if (!this._wallet) {
      this._wallet = this.ethersService.decryptWalletJsonSync(this.encryptedWallet.wallet, this.password);
    }
    return this._wallet;
  }

  constructor(
    private walletMnemonicService: WalletMnemonicService,
    private apiWalletService: ApiWalletService,
    private walletService: WalletService,
    private walletEncryptionService: WalletEncryptionService,
    private storageService: StorageService,
    private ethersService: EthersService
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

  async updateWalletNetworks(changedAssets: string[]): Promise<void> {
    this.walletMnemonicService.getMnemonic(this.wallet);

    this.newNetworks.forEach((network) => {
      this.encryptedWallet.addresses[network] = this.walletService.createForDerivedPath(
        environment.derivedPaths[network]
      ).address;

      this.apiWalletService.getCoinsFromNetwork(network).forEach((coin) => {
        this.encryptedWallet.assets[coin.value] = false;
      });
    });

    changedAssets.forEach((coin) => {
      this.encryptedWallet.assets[coin] = !this.encryptedWallet.assets[coin];
    });

    this.encryptedWallet.updatedAt = moment().utc().format();
  }

  toggleAssets(changedAssets: string[]) {
    changedAssets.forEach((asset) => {
      this.encryptedWallet.assets[asset] = !this.encryptedWallet.assets[asset];
    });
  }

  async saveWalletToStorage(): Promise<void> {
    await this.storageService.saveWalletToStorage(this.encryptedWallet);
    this._wallet = undefined;
    this.encryptedWallet = undefined;
    this.newNetworks = undefined;
    this.password = undefined;
  }

  async getUserAssets(): Promise<Coin[]> {
    await this.getEncryptedWalletFromStorage();
    const coins = this.apiWalletService.getCoins();
    return coins.filter((coin) => !!this.encryptedWallet.assets[coin.value]);
  }
}
