import { FakeTransactionResponse } from '../../transaction-response/fake/fake-transaction-response';

export class FakeEthersProvider {
  getTransaction(aHash: string): Promise<FakeTransactionResponse> {
    return Promise.resolve(new FakeTransactionResponse());
  }
}
