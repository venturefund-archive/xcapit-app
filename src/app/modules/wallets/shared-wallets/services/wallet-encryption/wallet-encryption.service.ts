import { Injectable } from '@angular/core';
import { Wallet } from 'ethers';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import { Coin } from '../../interfaces/coin.interface';
import { EthersService } from '../ethers/ethers.service';
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { WalletService } from '../wallet/wallet.service';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { StorageAsset } from '../../interfaces/storage-asset.interface';
import { StorageWallet } from '../../interfaces/storage-wallet.interface';
import { WalletCreationMethod } from 'src/app/shared/types/wallet-creation-method.type';

@Injectable({
  providedIn: 'root',
})
export class WalletEncryptionService {
  coins: Coin[];
  creationMethod: WalletCreationMethod = 'default';

  constructor(
    private walletsFactory: WalletsFactory,
    private storageService: StorageService,
    private ethersService: EthersService,
    private blockchainsFactory: BlockchainsFactory,
    private mnemonicService: WalletMnemonicService,
    private walletService: WalletService
  ) {}

  async encryptWallet(password: string): Promise<void> {
    await this.createWallets(new Password(password));
    await this.saveEncryptedWallet();
    this.creationMethod = 'default'
  }

  private async createWallets(aPassword: Password): Promise<void> {
    await this.walletsFactory.create().createFrom(
      this.mnemonicService.mnemonic.phrase,
      aPassword,
      // TODO: ver porque cambiando esto no fallo nada...
      this.blockchainsFactory.create(),
      this.creationMethod
    );
  }

  private async saveEncryptedWallet(): Promise<void> {
    await this.storageService.saveWalletToStorage(await this.storageStructure());
  }

  private async storageStructure(): Promise<StorageWallet> {
    return {
      alias: (await this.walletsFactory.create().oneBy(this.blockchainsFactory.create().oneByName('ERC20'))).address(),
      createdAt: moment().utc().format(),
      updatedAt: moment().utc().format(),
      network: environment.walletNetwork,
      assets: this.selectedAssetsStructure(),
      creationMethod: this.creationMethod,
    };
  }

  async getDecryptedERC20Wallet(password: string): Promise<Wallet> {
    const encryptedWallet: StorageWallet = await this.storageService.getWalletFromStorage();

    this.setCreationMethod(encryptedWallet);

    return Wallet.fromEncryptedJsonSync(encryptedWallet.wallet, password);
  }

  private setCreationMethod(encryptedWallet: StorageWallet) {
    this.creationMethod = encryptedWallet.creationMethod ? encryptedWallet.creationMethod : 'legacy';
  }

  async getDecryptedWalletForCurrency(password: string, currency: Coin): Promise<Wallet> {
    const erc20Wallet = await this.getDecryptedERC20Wallet(password);

    if (this.creationMethod === 'default') {
      this.creationMethod = undefined;
      return erc20Wallet;
    }

    return Wallet.fromMnemonic(erc20Wallet.mnemonic.phrase, environment.derivedPaths[currency.network]);
  }

  async getDecryptedWalletForNetwork(password: string, network: string): Promise<Wallet> {
    const erc20Wallet = await this.getDecryptedERC20Wallet(password);

    if (this.creationMethod === 'default') {
      this.creationMethod = undefined;
      return erc20Wallet;
    }

    return Wallet.fromMnemonic(erc20Wallet.mnemonic.phrase, environment.derivedPaths[network]);
  }

  getEncryptedWallet(): Promise<StorageWallet> {
    return this.storageService.getWalletFromStorage();
  }

  selectedAssetsStructure(): StorageAsset[] {
    return this.walletService.coins.map(({ value, network }) => ({ value, network }));
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
