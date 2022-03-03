import { parseEther } from 'ethers/lib/utils';

export class FakeTokenSend {
  constructor() {}

  static create(): FakeTokenSend {
    return new this();
  }

  value() {
    return {
      send: () => Promise.resolve(),
      sendEstimateFee: () => Promise.resolve(parseEther('0.00008')),
      formatFee: () => '0.00012',
    };
  }
}
