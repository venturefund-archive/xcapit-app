import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { Mnemonic } from '@ethersproject/hdnode';

@Injectable({
  providedIn: 'root',
})
export class WalletMnemonicService {
  mnemonic: Mnemonic;

  constructor(private languageService: LanguageService) {}

  newMnemonic() {
    return ethers.Wallet.createRandom({ locale: this.languageService.selected }).mnemonic;
  }
}
