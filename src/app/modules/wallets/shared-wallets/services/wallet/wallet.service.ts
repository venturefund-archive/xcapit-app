import { Injectable } from '@angular/core';
import { Coin } from '../../interfaces/coin.interface';
import { ethers } from 'ethers';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { BlockchainProviderService } from '../brockchain-provider/blockchain-provider.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  coins: Coin[];
  createdWallet: ethers.Wallet;

  constructor(
    private walletMnemonicService: WalletMnemonicService,
    private languageService: LanguageService,
    private blockchainProviderService: BlockchainProviderService
  ) {}

  create(): ethers.Wallet {
    if (this.mnemonicExists() && this.selectedCoins()) {
      this.createdWallet = ethers.Wallet.fromMnemonic(
        this.walletMnemonicService.mnemonic.phrase,
        "m/44'/60'/0'/0/0",
        ethers.wordlists[this.languageService.selected]
      );
      return this.createdWallet.connect(this.blockchainProviderService.provider);
    }
  }

  mnemonicExists(): boolean {
    return !!this.walletMnemonicService.mnemonic;
  }

  selectedCoins(): boolean {
    return !!this.coins && !!this.coins.length;
  }
}
