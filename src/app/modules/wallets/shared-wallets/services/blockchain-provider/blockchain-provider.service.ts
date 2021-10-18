import { Injectable } from '@angular/core';
import { BigNumber, Contract, ContractInterface, ethers, utils } from 'ethers';
import { COINS } from '../../../constants/coins';
import { parseUnits } from 'ethers/lib/utils';
import { SummaryData } from '../../../send/send-summary/interfaces/summary-data.interface';
import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { Coin } from '../../interfaces/coin.interface';
import { EthersService } from '../ethers/ethers.service';

@Injectable({
  providedIn: 'root',
})
export class BlockchainProviderService {
  nonce = 18;
  coins = COINS;

  constructor(private ethersService: EthersService) {}

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

  async estimateFee(rawTx: utils.Deferrable<TransactionRequest>, currency: Coin): Promise<BigNumber> {
    const provider = (await this.getProvider(currency.value)).provider as Provider;
    const contract = await this.ethersService.newContract(currency.contract, currency.abi, provider);
    const tx = await contract.populateTransaction.transfer({ from: rawTx.from, value: rawTx.value });
    console.log(tx);
    const estimatedGas = await provider.estimateGas(rawTx);
    const notNativeEstimatedGas = await provider.estimateGas(tx);
    const gasPrice = await provider.getGasPrice();
    console.log('Native estimate: ' + estimatedGas.mul(gasPrice));
    console.log('Not native estimate: ' + notNativeEstimatedGas.mul(gasPrice));
    return estimatedGas.mul(gasPrice);
  }

  async createRawTxFromSummaryData(
    summaryData: SummaryData,
    contract?: Contract
  ): Promise<utils.Deferrable<TransactionRequest>> {
    const data = {
      to: summaryData.address,
      value: parseUnits(
        summaryData.amount.toString(),
        summaryData.currency.decimals ? summaryData.currency.decimals : 18
      ),
    };

    // if (summaryData.currency.native) {
    return Promise.resolve(data);
    // }

    // return contract.populateTransaction.transfer(data);
  }
}
