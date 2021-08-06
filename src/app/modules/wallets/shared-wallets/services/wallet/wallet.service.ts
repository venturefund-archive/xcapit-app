import { Injectable } from '@angular/core';
import { Coin } from '../../interfaces/coin.interface';
import { ethers } from 'ethers';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  coins: Coin[];
  createdWallets: ethers.Wallet[];
  derivationPaths: string[] = ["m/44'/60'/0'/0/0"];

  constructor(private walletMnemonicService: WalletMnemonicService, private languageService: LanguageService) {}

  create(): ethers.Wallet[] {
    if (this.mnemonicExists() && this.selectedCoins()) {
      this.createdWallets = [];
      for (const derivedPath of this.derivationPaths) {
        this.createdWallets.push(this.createForDerivedPath(derivedPath));
      }
      return this.createdWallets;
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
}
