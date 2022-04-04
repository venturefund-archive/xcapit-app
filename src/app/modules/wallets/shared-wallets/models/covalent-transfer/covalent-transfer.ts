export class CovalentTransfer {
  from: string;
  to: string;
  symbol: string;
  type: 'IN' | 'OUT';
  icon: string;
  amount: number;
  quoteAmount: number;
  quoteCurrency: string;
  hash: string; 
  date: string;

  constructor(transfer: any, quoteCurrency: string) {
    this.from = transfer.from_address;
    this.to = transfer.to_address;
    this.quoteCurrency = quoteCurrency;
    this.hash = transfer.tx_hash;
    this.date = transfer.block_signed_at;
  }
}
