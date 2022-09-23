import { Injectable } from '@angular/core';
import { Wallet } from 'ethers';
import moment from 'moment';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { EthersService } from '../ethers/ethers.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';

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
    private walletEncryptionService: WalletEncryptionService,
    private storageService: StorageService,
    private ethersService: EthersService,
    private walletsFactory: WalletsFactory,
    private blockchainsFactory: BlockchainsFactory
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
    const promises = [];

    this.newNetworks.forEach((network) => {
      promises.push(this.createWalletsFromNetwork(network));
    });

    await Promise.all(promises)

    changedAssets.forEach((coin) => {
      this.encryptedWallet.assets[coin] = !this.encryptedWallet.assets[coin];
    });

    this.encryptedWallet.updatedAt = moment().utc().format();
  }

  private async createWalletsFromNetwork(network: string) {
    const wallets = this.walletsFactory.create();
    const blockchains = this.blockchainsFactory.create();

    await wallets.createFrom(
      this.walletMnemonicService.mnemonic.phrase,
      new Password(this.password),
      blockchains
    );

    this.encryptedWallet.addresses[network] = (await wallets.oneBy(blockchains.oneByName(network))).address();

    this.apiWalletService.getCoinsFromNetwork(network).forEach((coin) => {
      this.encryptedWallet.assets[coin.value] = false;
    });
  }

  toggleAssets(changedAssets: string[]) {
    changedAssets.forEach((asset) => {
      this.encryptedWallet.assets[asset] = !this.encryptedWallet.assets[asset];
    });
  }

  async saveWalletToStorage(): Promise<void> {
    await this.storageService.saveWalletToStorage(this.encryptedWallet);
    this.wipeDataFromService();
  }

  wipeDataFromService() {
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

  userHasCoin(coin: Coin): boolean {
    return this.encryptedWallet.assets[coin.value];
  }

  async addCoinIfUserDoesNotHaveIt(coin: Coin): Promise<void> {
    if (!this.encryptedWallet) {
      await this.getEncryptedWalletFromStorage();
    }

    if (!this.userHasCoin(coin)) {
      this.toggleAssets([coin.value]);
      await this.saveWalletToStorage();
    } else {
      this.wipeDataFromService();
    }
  }
}
