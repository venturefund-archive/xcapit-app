import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { FakeEthersProvider } from '../../../../../shared/models/ethers-providers/fake/fake-ethers-provider';
import { BlockchainTransactionResponses } from './blockchain-transaction-responses';
import { rawTransactionResponse } from '../../fixtures/raw-transaction-response';
import { rawTransactionReceipt } from '../../fixtures/raw-transaction-receipt';

describe('BlockchainTransactionResponses', () => {
  let blockchain: Blockchain;
  let blockchainTransactionsResponses: BlockchainTransactionResponses;

  beforeEach(() => {
    blockchain = new BlockchainsFactory().create().oneByName('MATIC');
    blockchainTransactionsResponses = new BlockchainTransactionResponses(new FakeEthersProvider());
  });

  it('new', async () => {
    expect(blockchainTransactionsResponses).toBeTruthy();
  });

  it('byHash', async () => {
    const transactionResponse = await blockchainTransactionsResponses.byHash(rawTransactionResponse.hash);
    expect((await transactionResponse.wait()).blockHash).toEqual(rawTransactionReceipt.blockHash);
  });
});
