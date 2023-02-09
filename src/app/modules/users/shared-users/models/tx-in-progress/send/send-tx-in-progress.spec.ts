import { TxInProgress } from '../tx-in-progress.interface';
import { SendTxInProgress } from './send-tx-in-progress';
import { rawSendTxInProgress } from '../../../../../wallets/shared-wallets/fixtures/raw-send-tx-in-progress';
import { DefaultTxHash } from '../../../../../wallets/shared-wallets/models/tx-hash/default/default-tx-hash';
import { rawSolanaSendTxInProgress } from '../../../../../wallets/shared-wallets/fixtures/raw-solana-send-tx-in-progress';
import { NullTxHash } from '../../../../../wallets/shared-wallets/models/tx-hash/null-tx-hash/null-tx-hash';
import { rawBlockchainsData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { DefaultBlockchains } from '../../../../../swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from '../../../../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';

describe('SendTxInProgress', () => {
  let txInProgress: TxInProgress;
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  beforeEach(() => {
    txInProgress = new SendTxInProgress(
      blockchains.oneByName('MATIC'),
      new DefaultTxHash(rawSendTxInProgress.hash),
      new Date(rawSendTxInProgress.timestamp)
    );
  });

  it('new', () => {
    expect(txInProgress).toBeTruthy();
  });

  it('timestamp', () => {
    expect(txInProgress.timestamp()).toEqual(new Date(rawSendTxInProgress.timestamp));
  });

  it('hash', () => {
    expect(txInProgress.hash()).toEqual(new DefaultTxHash(rawSendTxInProgress.hash));
  });

  it('type', () => {
    expect(txInProgress.type()).toEqual(rawSendTxInProgress.type);
  });

  it('type in solana send', () => {
    txInProgress = new SendTxInProgress(
      blockchains.oneByName('SOLANA'),
      new NullTxHash(),
      new Date(rawSolanaSendTxInProgress.timestamp)
    );
    expect(txInProgress.type()).toEqual(rawSolanaSendTxInProgress.type);
  });

  it('blockchain', () => {
    expect(txInProgress.blockchain().name()).toEqual(rawSendTxInProgress.blockchain);
  });

  it('json', () => {
    expect(txInProgress.json()).toEqual(rawSendTxInProgress);
  });
});
