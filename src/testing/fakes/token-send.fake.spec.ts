import { parseEther } from "ethers/lib/utils";
import { ERC20TokenSend } from "src/app/modules/wallets/shared-wallets/models/erc20-token-send/erc20-token-send.model";
import { NativeTokenSend } from "src/app/modules/wallets/shared-wallets/models/native-token-send/native-token-send.model";
import { Fake } from "./fake.spec";

export class FakeTokenSend implements Fake {
  private spy: jasmine.SpyObj<ERC20TokenSend | NativeTokenSend>;

  createSpy(fee: string = '0') {
    this.spy = jasmine.createSpyObj('TokenSend', ['sendEstimateFee', 'formatFee']);
    this.modifyReturns(fee);
    return this.createMockClass(this.spy);
  }

  modifyReturns(fee: string = '0') {
    this.spy.sendEstimateFee.and.returnValue(Promise.resolve(parseEther(fee)));
    this.spy.formatFee.and.returnValue(fee);
  }

  rejectPromises() {
    this.spy.sendEstimateFee.and.rejectWith('error');
  }

  private createMockClass(spy: jasmine.SpyObj<ERC20TokenSend | NativeTokenSend>) {
    return class TokenSendMock {
      static create(...args): any {
        return spy;
      }
    } 
  }
}