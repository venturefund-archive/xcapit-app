import { ethers } from 'ethers';
import { CovalentTransfer } from '../covalent-transfer/covalent-transfer';

export class CovalentNativeTransfer extends CovalentTransfer {
  constructor(transfer: any, quoteCurrency: string, symbol: string, address?: string) {
    super(transfer, quoteCurrency);
    this.symbol = symbol;
    this.type = transfer.to_address === address ? 'IN' : 'OUT';
    this.icon =
      this.type === 'IN' ? 'assets/img/wallet-transactions/received.svg' : 'assets/img/wallet-transactions/sended.svg';
    this.amount = parseFloat(ethers.utils.formatEther(transfer.value));
    this.quoteAmount = transfer.value_quote;
  }
}
