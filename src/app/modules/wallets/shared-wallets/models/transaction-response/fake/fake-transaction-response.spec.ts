import { FakeTransactionResponse } from './fake-transaction-response';
import { rawTransactionReceipt } from '../../../fixtures/raw-transactions-receipt';

describe('FakeTransactionResponse', () => {
  it('new', () => {
    expect(new FakeTransactionResponse()).toBeTruthy();
  });

  it('wait', async () => {
    expect((await new FakeTransactionResponse().wait()).blockHash).toEqual(rawTransactionReceipt.blockHash);
  });

  it('wait rejected', async () => {
    await expectAsync(new FakeTransactionResponse(Promise.reject()).wait()).toBeRejected();
  });
});
