import { Injectable } from '@angular/core';
import { ethers, Wallet } from 'ethers';
import { WalletService } from '../wallet/wallet.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { EthersService } from '../ethers/ethers.service';

@Injectable({
  providedIn: 'root',
})
export class WalletEncryptionService {
  private ethWallet: Wallet = null;
  private walletsAddresses = {};
  private selectedCoins = {};
  coins: Coin[];

  constructor(
    private walletService: WalletService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private ethersService: EthersService
  ) {}

  encryptWallet(password: string): Promise<any> {
    const derivedPaths = environment.derivedPaths;

    for (const [network, derivedPath] of Object.entries(derivedPaths)) {
      const wallet = this.walletService.createForDerivedPath(derivedPath);

      if (wallet instanceof ethers.Wallet) {
        if (network === 'ERC20') {
          this.ethWallet = wallet;
        }
        this.walletsAddresses[network] = wallet.address.toLowerCase();
      } else {
        this.walletsAddresses[network] = wallet.publicKey.toString();
      }
    }

    return this.saveEncryptedWallet(password);
  }

  private saveEncryptedWallet(password: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
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

  getDecryptedWalletForNetwork(password: string, network: string): Promise<Wallet> {
    return this.getDecryptedWallet(password).then((wallet) => {
      return Wallet.fromMnemonic(wallet.mnemonic.phrase, environment.derivedPaths[network]);
    });
  }

  getEncryptedWallet(): Promise<any> {
    return this.storageService.getWalletFromStorage();
  }

  selectedAssetsStructure() {
    this.coins = this.apiWalletService.getCoins();
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

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const encryptedWallet = await this.storageService.getWalletFromStorage();
    const wallet = this.ethersService.decryptWalletJsonSync(encryptedWallet.wallet, oldPassword);
    encryptedWallet.wallet = await this.ethersService.encryptWallet(wallet, newPassword);
    await this.storageService.saveWalletToStorage(encryptedWallet);
  }
}
