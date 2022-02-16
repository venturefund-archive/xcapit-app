import { parseEther } from "ethers/lib/utils";
import { ERC20TokenSend } from "src/app/modules/wallets/shared-wallets/models/erc20-token-send/erc20-token-send.model";
import { NativeTokenSend } from "src/app/modules/wallets/shared-wallets/models/native-token-send/native-token-send.model";
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { Fake } from "./fake.spec";

export class FakeTokenSend implements Fake {
  private _aSpy: jasmine.SpyObj<ERC20TokenSend | NativeTokenSend>;

  get spy(): jasmine.SpyObj<ERC20TokenSend | NativeTokenSend> {
    return this._aSpy;
  }

  createSpy(fee: string = '0') {
    this._aSpy = jasmine.createSpyObj('TokenSend', ['send', 'sendEstimateFee', 'formatFee']);
    this.modifyReturns(fee);
    return this.createMockClass(this._aSpy);
  }

  modifyReturns(fee: string = '0') {
    this._aSpy.sendEstimateFee.and.returnValue(Promise.resolve(parseEther(fee)));
    this._aSpy.formatFee.and.returnValue(fee);
    this._aSpy.send.and.returnValue(Promise.resolve({} as TransactionResponse));
  }

  rejectPromises() {
    this._aSpy.sendEstimateFee.and.rejectWith('error');
  }

  private createMockClass(spy: jasmine.SpyObj<ERC20TokenSend | NativeTokenSend>) {
    return class TokenSendMock {
      static create(...args): any {
        return spy;
      }
    } 
  }
}