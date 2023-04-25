import { rawTransactionReceipt } from '../../../../modules/wallets/shared-wallets/fixtures/raw-transaction-receipt';
import { FakeTransactionResponse } from '../../../../modules/wallets/shared-wallets/models/transaction-response/fake/fake-transaction-response';
import { TransactionReceipt } from '@ethersproject/abstract-provider';

export class FakeEthersProvider {
  getTransaction(aHash: string): Promise<FakeTransactionResponse> {
    return Promise.resolve(new FakeTransactionResponse());
  }

  getTransactionReceipt(aHash: string): Promise<TransactionReceipt>{
    return Promise.resolve(rawTransactionReceipt)
  }
}
