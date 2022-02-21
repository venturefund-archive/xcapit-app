import { Fake } from './fake.spec';
import { parseEther } from 'ethers/lib/utils';
import { JsonRpcProvider } from '@ethersproject/providers';

export class FakeERC20Provider implements Fake {
  private spy: jasmine.SpyObj<JsonRpcProvider>;

  constructor() {}

  createSpy(balance: string = '0'): any {
    this.spy = jasmine.createSpyObj('ERC20Provider', ['getBalance']);
    this.modifyReturns(balance);
    return this.createMockClass(this.spy);
  }

  modifyReturns(balance: string = '0') {
    this.spy.getBalance.and.returnValue(Promise.resolve(parseEther(balance)));
  }

  private createMockClass(spy: jasmine.SpyObj<JsonRpcProvider>) {
    return class ERC20ProviderMock {
        constructor(coin: any) {}

        value() {
            return spy;
        }
    } 
  }
}