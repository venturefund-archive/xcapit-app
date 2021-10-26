import { CovalentNoNativeTransfer } from './covalent-no-native-transfer';

const transfer = {
  from_address: 'testFromAddress',
  to_address: 'testToAddress',
  contract_decimals: 18,
  contract_ticker_symbol: 'LINK',
  delta: '100000000000000000000',
  delta_quote: 25000,
  transfer_type: 'OUT',
};

describe('CovalentNoNativeTransfer', () => {
  it('should create', () => {
    const nativeTransfer: CovalentNoNativeTransfer = new CovalentNoNativeTransfer(transfer, 'USD');
    expect(nativeTransfer.from).toBe('testFromAddress');
    expect(nativeTransfer.to).toBe('testToAddress');
    expect(nativeTransfer.type).toBe('OUT');
    expect(nativeTransfer.quoteAmount).toBe(25000);
    expect(nativeTransfer.quoteCurrency).toBe('USD');
    expect(nativeTransfer.icon).toBe('assets/img/wallet-transactions/sended.svg');
    expect(nativeTransfer.amount).toBe(100);
  });
});
