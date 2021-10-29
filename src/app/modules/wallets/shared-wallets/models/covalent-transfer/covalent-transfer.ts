export class CovalentTransfer {
  from: string;
  to: string;
  symbol: string;
  type: 'IN' | 'OUT';
  icon: string;
  amount: number;
  quoteAmount: number;
  quoteCurrency: string;

  constructor(transfer: any, quoteCurrency: string) {
    this.from = transfer.from_address;
    this.to = transfer.to_address;
    this.quoteCurrency = quoteCurrency;
  }
}
