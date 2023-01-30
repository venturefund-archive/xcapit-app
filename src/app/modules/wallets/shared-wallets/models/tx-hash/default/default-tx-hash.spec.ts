import { TxHash } from '../tx-hash.interface';
import { DefaultTxHash } from './default-tx-hash';

describe('DefaultTxHash', () => {
  const aTestHash = 'aTestHash';
  let txHash: TxHash;

  beforeEach(() => {
    txHash = new DefaultTxHash(aTestHash);
  });

  it('new', () => {
    expect(txHash).toBeTruthy();
  });

  it('value', () => {
    expect(txHash.value()).toEqual(aTestHash);
  });
});
