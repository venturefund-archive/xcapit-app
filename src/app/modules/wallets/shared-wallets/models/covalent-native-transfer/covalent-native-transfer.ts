import { ethers } from 'ethers';
import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { Coin } from '../../interfaces/coin.interface';
import { CovalentTransfer } from '../covalent-transfer/covalent-transfer';

export class CovalentNativeTransfer extends CovalentTransfer {
  constructor(private transfer: any, quoteCurrency: string, private asset: Coin, address?: string) {
    super(transfer, quoteCurrency);
    this.symbol = asset.value;
    this.type = transfer.to_address === address ? 'IN' : 'OUT';
    this.icon =
      this.type === 'IN' ? 'assets/img/wallet-transactions/received.svg' : 'assets/img/wallet-transactions/sended.svg';
    this.amount = parseFloat(ethers.utils.formatEther(transfer.value));
    this.quoteAmount = transfer.value_quote;
    this.successful = transfer.successful;
  }

  getFee() {
    const nativeToken = new BlockchainsFactory().create().oneByName(this.asset.network).nativeToken();
    return new AmountOf(this.transfer.gas_spent, nativeToken).times(this.transfer.gas_price).value();
  } 
}
