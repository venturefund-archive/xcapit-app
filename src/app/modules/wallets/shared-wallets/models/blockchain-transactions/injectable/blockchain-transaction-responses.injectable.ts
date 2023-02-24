import { Injectable } from '@angular/core';
import { BlockchainTransactionResponses } from '../blockchain-transaction-responses';
import { Provider } from '@ethersproject/abstract-provider';
import { FakeEthersProvider } from '../../ethers-providers/fake/fake-ethers-provider';

@Injectable({ providedIn: 'root' })
export class BlockchainTransactionResponsesInjectable {
  constructor() {}
  public create(provider: Provider | FakeEthersProvider): BlockchainTransactionResponses {
    return new BlockchainTransactionResponses(provider);
  }
}
