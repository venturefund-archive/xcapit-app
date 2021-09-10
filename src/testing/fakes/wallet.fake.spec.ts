import { Fake } from './fake.spec';

export class FakeConnectedWallet implements Fake {
  private readonly sendTransactionResponse;
  private spy;

  constructor(sendTransactionResponse = null) {
    this.sendTransactionResponse = sendTransactionResponse;
  }

  createSpy(): any {
    this.spy = jasmine.createSpyObj('ConnectedWallet', ['sendTransaction']);
    this.modifyReturns(this.sendTransactionResponse);
    return this.spy;
  }

  modifyReturns(sendTransactionResponse: any): void {
    this.spy.sendTransaction.and.returnValue(Promise.resolve(sendTransactionResponse));
  }
}
