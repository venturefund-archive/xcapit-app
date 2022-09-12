import { Injectable } from '@angular/core';
import { Wallet } from 'ethers';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { EthersService } from '../ethers/ethers.service';
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { DefaultWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable({
  providedIn: 'root',
})
export class WalletEncryptionService {
  private encWallet: string;
  private ethereumAddress: string;
  private walletsAddresses = {};
  private selectedCoins = {};
  coins: Coin[];

  constructor(
    private walletsFactory: WalletsFactory,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private ethersService: EthersService,
    private blockchainsFactory: BlockchainsFactory,
    private mnemonicService: WalletMnemonicService,
    private walletService: WalletService
  ) {}

  async encryptWallet(password: string): Promise<any> {
    const walletsFactory = this.walletsFactory.createFromPhrase(password, this.mnemonicService.mnemonic.phrase);

    for (const blockchain of this.blockchainsFactory.create().value()) {
      const wallet = await walletsFactory.oneBy(blockchain);
      this.walletsAddresses[blockchain.name()] = wallet.address();
      if (blockchain.name() === 'ERC20') {
        this.encWallet = (wallet as DefaultWallet).encryptedWallet();
        this.ethereumAddress = wallet.address();
      }
    }

    return this.saveEncryptedWallet();
  }

  private saveEncryptedWallet(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
        const structure = this.storageStructure();
        await this.storageService.saveWalletToStorage(structure);
        resolve(true);
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

  private storageStructure() {
    return {
      alias: this.ethereumAddress,
      wallet: this.encWallet,
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
