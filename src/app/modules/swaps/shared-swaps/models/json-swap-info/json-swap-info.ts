import { SwapInfoOf } from "../swap-info-of/swap-info-of";


export type RawSwapInfo = {
  toTokenAmount: number,
  estimatedGas: number
}


export class JSONSwapInfo {

  constructor(private _swapInfo: SwapInfoOf) { }

  async value(): Promise<RawSwapInfo> {
    return {
      toTokenAmount: (await this._swapInfo.toTokenAmount()).value(),
      estimatedGas: await this._swapInfo.estimatedGas()
    };
  }
}


export class NullJSONSwapInfo {

  value(): RawSwapInfo {
    return {
      toTokenAmount: 0,
      estimatedGas: 0
    }
  }
}
