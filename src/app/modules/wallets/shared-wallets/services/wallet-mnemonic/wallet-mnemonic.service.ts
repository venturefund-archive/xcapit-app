import { Injectable } from '@angular/core';
import { ethers, Wallet } from 'ethers';
import { Mnemonic } from '@ethersproject/hdnode';

@Injectable({
  providedIn: 'root',
})
export class WalletMnemonicService {
  mnemonic: Mnemonic;

  constructor() {}

  newMnemonic() {
    return ethers.Wallet.createRandom({ locale: 'en' }).mnemonic;
  }

  importMnemonic(phrase: string) {
    this.mnemonic = ethers.Wallet.fromMnemonic(phrase, null, ethers.wordlists.en).mnemonic;
  }

  getMnemonic(decryptedWallet?: Wallet): Mnemonic {
    if (!this.mnemonic) {
      this.mnemonic = decryptedWallet._mnemonic();
    }

    return this.mnemonic;
  }
}
