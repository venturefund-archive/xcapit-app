import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { Provider } from '@ethersproject/abstract-provider';
import { FakeEthersProvider } from 'src/app/shared/models/ethers-providers/fake/fake-ethers-provider';

export class TransactionReceiptOf {
  constructor(private readonly aHash: string, private readonly aProvider: Provider | FakeEthersProvider) {}

  value(): Promise<TransactionReceipt> {
    return this.aProvider.getTransactionReceipt(this.aHash);
  }
}
