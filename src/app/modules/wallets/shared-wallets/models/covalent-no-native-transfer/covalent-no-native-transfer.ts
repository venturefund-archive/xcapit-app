import { CovalentTransfer } from '../covalent-transfer/covalent-transfer';

export class CovalentNoNativeTransfer extends CovalentTransfer {
  constructor(transfer: any, quoteCurrency: string) {
    super(transfer, quoteCurrency);
    this.symbol = transfer.contract_ticker_symbol;
    this.type = transfer.transfer_type;
    this.icon =
      this.type === 'IN' ? 'assets/img/wallet-transactions/received.svg' : 'assets/img/wallet-transactions/sended.svg';
    this.amount = parseInt(transfer.delta, 10) / Math.pow(10, transfer.contract_decimals);
    this.quoteAmount = parseFloat(transfer.delta_quote);
  }
}
