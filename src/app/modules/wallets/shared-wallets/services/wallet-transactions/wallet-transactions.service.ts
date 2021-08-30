import { Injectable } from '@angular/core';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { LoadingService } from '../../../../../shared/services/loading/loading.service';
import { ethers } from 'ethers';
import { BlockchainProviderService } from '../brockchain-provider/blockchain-provider.service';
import { Coin } from '../../interfaces/coin.interface';

@Injectable({
  providedIn: 'root',
})
export class WalletTransactionsService {
  constructor(
    private walletEncryptionService: WalletEncryptionService,
    private loadingService: LoadingService,
    private blockchainProviderService: BlockchainProviderService
  ) {}

  async send(password: string, amount: number | string, targetAddress: string, currency: Coin, loading = true) {
    if (loading) await this.loadingService.show();
    const wallet = await this.walletEncryptionService.getDecryptedWallet(password);
    wallet.connect(this.blockchainProviderService.provider).sendTransaction({
      to: targetAddress,
      value: ethers.utils.parseEther(amount.toString()),
    });
    await this.loadingService.dismiss();
  }
}
