import { FakeEthersProvider } from 'src/app/shared/models/ethers-providers/fake/fake-ethers-provider';
import { rawTransactionReceipt } from 'src/app/modules/wallets/shared-wallets/fixtures/raw-transaction-receipt';
import { TransactionReceiptOf } from './transaction-receipt-of';

describe('TransactionReceiptOf', () => {
  let transactionReceiptOf: TransactionReceiptOf;
  let fakeProvider: FakeEthersProvider;
  beforeEach(() => {
    fakeProvider = new FakeEthersProvider();
    transactionReceiptOf = new TransactionReceiptOf('aHash', fakeProvider);
  });

  it('new', () => {
    expect(transactionReceiptOf).toBeTruthy();
  });

  it('value', async () => {
    expect(await transactionReceiptOf.value()).toEqual(rawTransactionReceipt);
  });
});
