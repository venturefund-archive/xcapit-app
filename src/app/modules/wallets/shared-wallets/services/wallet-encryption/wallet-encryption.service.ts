import { Injectable } from '@angular/core';
import { Wallet } from 'ethers';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { EthersService } from '../ethers/ethers.service';
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { WalletService } from '../wallet/wallet.service';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';

@Injectable({
  providedIn: 'root',
})
export class WalletEncryptionService {
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
    await this.createWallets(new Password(password));
    await this.saveEncryptedWallet();
  }

  private async createWallets(aPassword: Password): Promise<void> {
    await this.walletsFactory.create().createFrom(
      this.mnemonicService.mnemonic.phrase,
      aPassword,
      this.blockchainsFactory.create()
    );
  }

  private async saveEncryptedWallet(): Promise<void> {
    await this.storageService.saveWalletToStorage(await this.storageStructure());
  }

  private async storageStructure() {
    return {
      alias: (await this.walletsFactory.create().oneBy(this.blockchainsFactory.create().oneByName('ERC20'))).address(),
      createdAt: moment().utc().format(),
      updatedAt: moment().utc().format(),
      network: environment.walletNetwork,
      assets: this.selectedAssetsStructure(),
    };
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
