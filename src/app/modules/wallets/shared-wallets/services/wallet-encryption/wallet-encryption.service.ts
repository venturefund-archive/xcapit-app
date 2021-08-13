import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletService } from '../wallet/wallet.service';
import { DerivedPaths } from '../../../enums/derived-paths.enum';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletEncryptionService {
  private ethWallet: any = null;
  private walletsAddresses = {};

  constructor(private storage: AppStorageService, private walletService: WalletService) {}

  encryptWallet(password: string): Promise<any> {
    const wallets = this.walletService.createdWallets;

    wallets.forEach((wallet) => {
      if (wallet.mnemonic.path === DerivedPaths.ETH) {
        this.ethWallet = wallet;
      }

      const key = Object.keys(DerivedPaths).filter((keyName) => DerivedPaths[keyName] === wallet.mnemonic.path);
      const value = wallet.address;

      this.walletsAddresses[key[0]] = value;
    });
    return this.saveEncryptedWallet(password);
  }

  private saveEncryptedWallet(password: string): Promise<any> {
    return new Promise<any>(async (resolve) => {
      this.ethWallet.encrypt(password).then(async (wallet) => {
        const structure = this.storageStructure(wallet);
        await this.storage.set('enc_wallet', structure);

        resolve(true);
      });
    });
  }

  private getDecryptedWallet(password: string): Promise<any> {
    return new Promise<any>(async (resolve) => {
      const storageWallet = await this.storage.get('enc_wallet');

      const res = ethers.Wallet.fromEncryptedJsonSync(storageWallet.wallet, password);

      resolve(res);
    });
  }

  getEncryptedWallet(): Promise<any> {
    return this.storage.get('enc_wallet');
  }

  private storageStructure(encWallet) {
    return {
      alias: this.ethWallet.address,
      wallet: encWallet,
      createdAt: moment().utc().format(),
      updatedAt: moment().utc().format(),
      addresses: this.walletsAddresses,
      network: environment.walletNetwork,
    };
  }

  async encryptedWalletExist(): Promise<boolean> {
    return !!(await this.storage.get('enc_wallet'));
  }
}
