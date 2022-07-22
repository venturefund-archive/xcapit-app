import { BigNumber } from "ethers";


export const fakeRawGasPrice = BigNumber.from('100');


class JsonRpcProvider {
  constructor(aRPCUrl: string) {}

  getGasPrice(): Promise<BigNumber> {
    return Promise.resolve(fakeRawGasPrice);
  }
}


export const fakeProviders = {
  JsonRpcProvider
}
