import { Injectable } from '@angular/core';
import { BigNumber, ethers, utils } from 'ethers';
import { COINS } from '../../../constants/coins';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { Coin } from '../../interfaces/coin.interface';

@Injectable({
  providedIn: 'root',
})
export class BlockchainProviderService {
  nonce = 18;
  coins = COINS;

  constructor() {}

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
    const selectedCoin = this.coins.filter((coin) => coin.value === coinSymbol)[0];

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

  async estimateFee(currency: Coin, destinationAddress: string, amountToSend: string | number) {
    const provider = (await this.getProvider(currency.value)).provider;
    const estimatedGas = await provider.estimateGas({
      to: destinationAddress,
      value: parseUnits(amountToSend.toString(), currency.decimals ? currency.decimals : 18),
    });
    const fee = await provider.getFeeData();
    return estimatedGas * fee.gasPrice;
  }
}
