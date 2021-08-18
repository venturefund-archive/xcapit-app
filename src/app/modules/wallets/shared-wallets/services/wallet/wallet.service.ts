import { Injectable } from '@angular/core';
import { Coin } from '../../interfaces/coin.interface';
import { ethers } from 'ethers';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { BlockchainProviderService } from '../brockchain-provider/blockchain-provider.service';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { DerivedPaths } from '../../../enums/derived-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  coins: Coin[];
  createdWallets: ethers.Wallet[];
  derivationPaths: string[] = ["m/44'/60'/0'/0/0"];
  addresses: any = null;

  constructor(
    private walletMnemonicService: WalletMnemonicService,
    private blockchainProviderService: BlockchainProviderService,
    private languageService: LanguageService,
    private appStorageService: AppStorageService
  ) {}

  create(): ethers.Wallet[] {
    if (this.mnemonicExists() && this.selectedCoins()) {
      this.createdWallets = [];
      this.getDerivedPaths();

      for (const derivedPath of this.derivationPaths) {
        this.createdWallets.push(this.createForDerivedPath(derivedPath));
      }

      return this.createdWallets;
    }
  }

  private getDerivedPaths() {
    for (const coin of this.coins) {
      if (!this.derivationPaths.includes(DerivedPaths[coin.network])) {
        this.derivationPaths.push(DerivedPaths[coin.network]);
      }
    }
  }

  private createForDerivedPath(derivedPath: string) {
    return ethers.Wallet.fromMnemonic(this.walletMnemonicService.mnemonic.phrase, derivedPath, this.wordList());
  }

  private wordList() {
    return ethers.wordlists[this.languageService.selected];
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
    const wallets = await this.appStorageService.get('enc_wallet');

    if (!!wallets) {
      this.addresses = wallets.addresses;
    }

    return !!wallets;
  }
}
