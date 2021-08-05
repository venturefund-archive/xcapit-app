import { Injectable } from '@angular/core';
import { Coin } from '../../interfaces/coin.interface';
import { ethers } from 'ethers';
import { Mnemonic } from '@ethersproject/hdnode';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  coins: Coin[];

  constructor() {}

  create(mnemonic: Mnemonic) {
    console.log(mnemonic);
    const wallet = ethers.Wallet.fromMnemonic(mnemonic.phrase);
    console.log(wallet);
  }
}
