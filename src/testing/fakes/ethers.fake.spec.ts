import { Fake } from './fake.spec';

export class FakeEthersService implements Fake {
  private readonly transferResponse;
  private spy;

  constructor(transferResponse = null) {
    this.transferResponse = transferResponse;
  }

  createSpy(): any {
    this.spy = jasmine.createSpyObj('EthersService', ['ethers', 'newContract']);
    this.modifyReturns(this.transferResponse);
    return this.spy;
  }

  modifyReturns(transferResponse): void {
    this.spy.newContract.and.returnValue({
      populateTransaction: {
        transfer: () => Promise.resolve(transferResponse),
      },
      transfer: () => Promise.resolve(transferResponse),
    });
  }
}
