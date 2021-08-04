import { Injectable } from '@angular/core';
import { Coin } from '../../interfaces/coin.interface';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  coins: Coin[];

  constructor(private walletMnemonicService: WalletMnemonicService) {}
}
