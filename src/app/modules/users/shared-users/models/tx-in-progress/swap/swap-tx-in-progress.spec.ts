import { rawSwapTxInProgress } from 'src/app/modules/wallets/shared-wallets/fixtures/raw-swap-tx-in-progress';
import { TxInProgress } from '../tx-in-progress.interface';
import { SwapTxInProgress } from './swap-tx-in-progress';
import { Blockchain } from '../../../../../swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';

describe('SwapTxInProgress', () => {
  let txInProgress: TxInProgress;
  const blockchain = new Blockchain(rawPolygonData);

  beforeEach(() => {
    txInProgress = new SwapTxInProgress(blockchain, new Date(rawSwapTxInProgress.timestamp));
  });

  it('new', () => {
    expect(txInProgress).toBeTruthy();
  });

  it('timestamp', () => {
    expect(txInProgress.timestamp()).toEqual(new Date(rawSwapTxInProgress.timestamp));
  });

  it('blockchain', () => {
    expect(txInProgress.blockchain()).toEqual(blockchain);
  });

  it('type', () => {
    expect(txInProgress.type()).toEqual(rawSwapTxInProgress.type);
  });

  it('hash', () => {
    expect(txInProgress.hash().value()).toEqual('');
  });

  it('json', () => {
    expect(txInProgress.json()).toEqual(rawSwapTxInProgress);
  });
});
