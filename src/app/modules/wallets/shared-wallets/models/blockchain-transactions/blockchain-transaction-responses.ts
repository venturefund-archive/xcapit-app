import { FakeEthersProvider } from '../ethers-providers/fake/fake-ethers-provider';
import { FakeTransactionResponse } from '../transaction-response/fake/fake-transaction-response';
import { Provider, TransactionResponse } from '@ethersproject/abstract-provider';

export class BlockchainTransactionResponses {
  constructor(private _aProvider: FakeEthersProvider | Provider) {}

  byHash(aHash: string): Promise<FakeTransactionResponse | TransactionResponse> {
    return this._aProvider.getTransaction(aHash);
  }
}
