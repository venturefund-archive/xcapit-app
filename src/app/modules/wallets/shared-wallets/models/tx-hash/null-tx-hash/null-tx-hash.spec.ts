import { TxHash } from '../tx-hash.interface';
import { NullTxHash } from './null-tx-hash';

describe('NullTxHash', () => {
  let txHash: TxHash;

  beforeEach(() => {
    txHash = new NullTxHash();
  });

  it('new', () => {
    expect(txHash).toBeTruthy();
  });

  it('value', () => {
    expect(txHash.value()).toEqual('');
  });
});
