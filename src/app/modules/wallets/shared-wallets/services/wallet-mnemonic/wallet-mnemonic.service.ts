import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { LanguageService } from 'src/app/shared/services/language/language.service';

@Injectable({
  providedIn: 'root',
})
export class WalletMnemonicService {
  constructor(private languageService: LanguageService) {}

  mnemonic() {
    return ethers.Wallet.createRandom({ locale: this.languageService.selected }).mnemonic;
  }
}
