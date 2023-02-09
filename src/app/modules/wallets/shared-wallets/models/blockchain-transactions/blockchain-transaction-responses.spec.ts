import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { FakeEthersProvider } from '../ethers-providers/fake/fake-ethers-provider';
import { rawTransactionReceipt } from '../../fixtures/raw-transactions-receipt';
import { BlockchainTransactionResponses } from './blockchain-transaction-responses';

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
    const transactionResponse = await blockchainTransactionsResponses.byHash(rawTransactionReceipt.hash);
    expect((await transactionResponse.wait()).blockHash).toEqual(rawTransactionReceipt.blockHash);
  });
});
