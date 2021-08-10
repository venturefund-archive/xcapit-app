import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlockchainProviderService {
  provider: ethers.providers.JsonRpcProvider;
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(environment.ethAlchemyApiUrl);
  }

  getFormattedBalanceOf(address: string): Promise<string> {
    return this.provider.getBalance(address).then(ethers.utils.formatEther);
  }
}
