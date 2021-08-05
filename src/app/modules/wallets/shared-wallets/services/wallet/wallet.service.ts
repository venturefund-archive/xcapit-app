import { Injectable } from '@angular/core';
import { Coin } from '../../interfaces/coin.interface';
import { ethers } from 'ethers';
import { Mnemonic } from '@ethersproject/hdnode';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  coins: Coin[];

  constructor(private walletMnemonicService: WalletMnemonicService, private languageService: LanguageService) {}

  create() {
    if (this.mnemonicExists() && this.selectedCoins()) {
      const wallet = ethers.Wallet.fromMnemonic(
        this.walletMnemonicService.mnemonic.phrase,
        "m/44'/60'/0'/0/0",
        ethers.wordlists[this.languageService.selected]
      );
    }
  }

  mnemonicExists(): boolean {
    return !!this.walletMnemonicService.mnemonic;
  }

  selectedCoins(): boolean {
    return !!this.coins && !!this.coins.length;
  }
}
