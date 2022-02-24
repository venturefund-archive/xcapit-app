import { Injectable } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Coin } from '../../interfaces/coin.interface';
import { EthersService } from '../ethers/ethers.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../api-wallet/api-wallet.service';

@Injectable({
  providedIn: 'root',
})
export class BlockchainProviderService {
  nonce = 18;
  coins: Coin[];

  constructor(
    private ethersService: EthersService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService
  ) {}

  async getFormattedBalanceOf(address: string, coin: string): Promise<string> {
    const params = await this.getProvider(coin);

    if (!!params.contract && !!params.abi) {
      const contract = this.createContract(params.contract, params.abi, params.provider);

      return await contract.balanceOf(address).then((value) => {
        const balance = ethers.utils.parseUnits(value.toString(), this.nonce - params.decimals);
        return ethers.utils.formatEther(balance.toString());
      });
    } else {
      return await params.provider.getBalance(address).then(ethers.utils.formatEther);
    }
  }

  async getProvider(coinSymbol: string): Promise<any> {
    const selectedCoin = this.apiWalletService.getCoin(coinSymbol);

    return {
      contract: selectedCoin.contract,
      abi: selectedCoin.abi,
      decimals: selectedCoin.decimals ? selectedCoin.decimals : 18,
      provider: this.createProvider(selectedCoin.rpc),
    };
  }

  createProvider(rpc: string) {
    return new ethers.providers.JsonRpcProvider(rpc);
  }

  createContract(contract, abi, provider) {
    return new ethers.Contract(contract, abi, provider);
  }
}
