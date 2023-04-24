import { Fake } from './fake.spec';
import { parseEther } from 'ethers/lib/utils';
import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';

export class FakeERC20Provider implements Fake {
  private spy: jasmine.SpyObj<JsonRpcProvider>;

  constructor() {}

  createSpy(balance: string = '0', estimatedGas: BigNumber = BigNumber.from('0')): any {
    this.spy = jasmine.createSpyObj('ERC20Provider', ['getBalance', 'estimateGas']);
    this.modifyReturns(balance, estimatedGas);
    return this.createMockClass(this.spy);
  }

  modifyReturns(balance: string = '0', estimatedGas: BigNumber = BigNumber.from('0')) {
    this.spy.getBalance.and.returnValue(Promise.resolve(parseEther(balance)));
    this.spy.estimateGas.and.returnValue(Promise.resolve(estimatedGas));
  }

  private createMockClass(spy: jasmine.SpyObj<JsonRpcProvider>) {
    return class ERC20ProviderMock {
      constructor(coin: any) {}

      value() {
        return spy;
      }
    };
  }
}
