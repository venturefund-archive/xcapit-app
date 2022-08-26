import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { Coin } from '../../interfaces/coin.interface';
import { CovalentTransfer } from '../covalent-transfer/covalent-transfer';

export class CovalentNoNativeTransfer extends CovalentTransfer {
  constructor(private transfer: any, quoteCurrency: string, successful: boolean, private asset: Coin) {
    super(transfer, quoteCurrency);
    this.symbol = transfer.contract_ticker_symbol;
    this.type = transfer.transfer_type;
    this.icon =
      this.type === 'IN' ? 'assets/img/wallet-transactions/received.svg' : 'assets/img/wallet-transactions/sended.svg';
    this.amount = parseInt(transfer.delta, 10) / Math.pow(10, transfer.contract_decimals);
    this.quoteAmount = parseFloat(transfer.delta_quote);
    this.successful = successful;
  }

  getFee() {
    const nativeToken = new BlockchainsFactory().create().oneByName(this.asset.network).nativeToken();
    return new AmountOf(this.transfer.gas_spent, nativeToken).times(this.transfer.gas_price).value();
  }
}
