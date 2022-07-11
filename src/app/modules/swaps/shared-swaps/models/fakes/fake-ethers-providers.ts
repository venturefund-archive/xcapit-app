import { BigNumber } from "ethers";


export const fakeGasPrice = BigNumber.from('100');


class JsonRpcProvider {
  constructor(aRPCUrl: string) {}

  getGasPrice(): Promise<BigNumber> {
    return Promise.resolve(fakeGasPrice);
  }
}


export const providers = {
  JsonRpcProvider
}
