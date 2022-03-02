import { parseEther } from 'ethers/lib/utils';

export class FakeTokenSend {
  constructor() {}

  value() {
    return {
      send: () => Promise.resolve(),
      sendEstimateFee: () => Promise.resolve(parseEther('0.00008')),
      formatFee: () => '0.00012',
    };
  }

  static create(): FakeTokenSend {
    return new this();
  }
}
