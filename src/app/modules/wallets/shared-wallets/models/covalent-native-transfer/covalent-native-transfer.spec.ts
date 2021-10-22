import { CovalentNativeTransfer } from './covalent-native-transfer';

const transfer = {
  from_address: 'testFromAddress',
  to_address: 'testAddress',
  value: '10000000000000000',
  value_quote: 30,
};

describe('CovalentNativeTransfer', () => {
  it('should create', () => {
    const nativeTransfer: CovalentNativeTransfer = new CovalentNativeTransfer(transfer, 'USD', 'ETH', 'testAddress');
    expect(nativeTransfer.from).toBe('testFromAddress');
    expect(nativeTransfer.to).toBe('testAddress');
    expect(nativeTransfer.type).toBe('IN');
    expect(nativeTransfer.quoteAmount).toBe(30);
    expect(nativeTransfer.quoteCurrency).toBe('USD');
    expect(nativeTransfer.icon).toBe('assets/img/wallet-transactions/received.svg');
    expect(nativeTransfer.amount).toBe(0.01);
  });
});
