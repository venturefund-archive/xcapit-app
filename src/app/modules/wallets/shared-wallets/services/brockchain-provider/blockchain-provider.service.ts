import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { COINS } from '../../../constants/coins';

@Injectable({
  providedIn: 'root',
})
export class BlockchainProviderService {
  provider: ethers.providers.JsonRpcProvider;
  constructor() {}

  async getFormattedBalanceOf(address: string, coin: string): Promise<string> {
    this.getProvider(coin);

    return await this.provider.getBalance(address).then(ethers.utils.formatEther);
  }

  getProvider(coinSymbol: string) {
    const selectedCoin = COINS.filter((coin) => coin.value === coinSymbol)[0];

    this.provider = new ethers.providers.JsonRpcProvider(selectedCoin.rpc);
  }
}
