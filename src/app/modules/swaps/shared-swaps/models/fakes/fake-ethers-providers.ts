import { BigNumber } from "ethers";

class JsonRpcProvider {
  constructor(aRPCUrl: string) {}

  getGasPrice(): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from('100'));
  }
}


export const providers = {
  JsonRpcProvider
}
