import { rawTransactionReceipt } from '../../../fixtures/raw-transaction-receipt';

export class FakeTransactionResponse {
  constructor(private _aWaitResponse: Promise<any> = Promise.resolve(rawTransactionReceipt)) {}
  wait(): Promise<any> {
    return this._aWaitResponse;
  }
}
