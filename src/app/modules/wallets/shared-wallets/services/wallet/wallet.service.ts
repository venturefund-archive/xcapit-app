import { Injectable } from '@angular/core';
import { Coin } from '../../interfaces/coin.interface';
import { ethers } from 'ethers';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { Keypair } from '@solana/web3.js';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  coins: Coin[];
  addresses: any = null;
  ethers = ethers;

  constructor(
    private walletMnemonicService: WalletMnemonicService,
    private blockchainProviderService: BlockchainProviderService,
    private storageService: StorageService
  ) {}

  mnemonicExists(): boolean {
    return !!this.walletMnemonicService.mnemonic;
  }

  selectedCoins(): boolean {
    return !!this.coins && !!this.coins.length;
  }

  balanceOf(address: string, coin: string, network: string): Promise<string> {
    return this.blockchainProviderService.getFormattedBalanceOf(address, coin, network);
  }

  async walletExist(): Promise<boolean> {
    const wallets = await this.storageService.getWalletFromStorage();

    if (wallets) {
      this.addresses = wallets.addresses;
    }

    return !!wallets;
  }
}
