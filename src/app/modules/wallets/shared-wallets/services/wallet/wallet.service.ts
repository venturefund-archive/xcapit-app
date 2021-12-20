import { Injectable } from '@angular/core';
import { Coin } from '../../interfaces/coin.interface';
import { ethers } from 'ethers';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage-wallets/storage-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  coins: Coin[];
  createdWallets: ethers.Wallet[];
  addresses: any = null;
  userCoins: Coin[];

  constructor(
    private walletMnemonicService: WalletMnemonicService,
    private blockchainProviderService: BlockchainProviderService,
    private storageService: StorageService
  ) {}

  create(): Promise<ethers.Wallet[]> {
    return new Promise((resolve) => {
      if (this.mnemonicExists() && this.selectedCoins()) {
        this.createdWallets = [];
        const derivedPaths = environment.derivedPaths;
        Object.values(derivedPaths).forEach((path) => {
          this.createdWallets.push(this.createForDerivedPath(path));
        });
      }
      resolve(this.createdWallets);
    });
  }

  private createForDerivedPath(derivedPath: string) {
    return ethers.Wallet.fromMnemonic(this.walletMnemonicService.mnemonic.phrase, derivedPath, this.wordList());
  }

  private wordList() {
    return ethers.wordlists.en;
  }

  mnemonicExists(): boolean {
    return !!this.walletMnemonicService.mnemonic;
  }

  selectedCoins(): boolean {
    return !!this.coins && !!this.coins.length;
  }

  balanceOf(address: string, coin: string): Promise<string> {
    return this.blockchainProviderService.getFormattedBalanceOf(address, coin);
  }

  async walletExist(): Promise<boolean> {
    const wallets = await this.storageService.getWalletFromStorage();

    if (wallets) {
      this.addresses = wallets.addresses;
    }

    return !!wallets;
  }

  isUpdated(): boolean {
    return true;
  }

  getMnemonic() {}
}
