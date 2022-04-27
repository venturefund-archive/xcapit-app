import { BigNumber } from 'ethers';
import { Fake } from './fake.spec';

export class FakeProvider implements Fake {
  private spy: any;

  constructor(private _getGasPriceReturn: any = {}) {}

  createSpy() {
    this.spy = jasmine.createSpyObj(
      'Provider',
      {
        getGasPrice: () => Promise.resolve(),
      },
      { _isProvider: true }
    );
    this.modifyReturns(this._getGasPriceReturn);
    return this.spy;
  }

  modifyReturns(_getGasPriceReturn) {
    this.spy.getGasPrice.and.resolveTo(BigNumber.from(_getGasPriceReturn));
  }
}
