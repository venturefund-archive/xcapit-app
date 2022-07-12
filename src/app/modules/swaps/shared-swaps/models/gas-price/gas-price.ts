import { BigNumber, providers } from "ethers";
import { Blockchain } from "../blockchain/blockchain";


export interface GasPrices {
  safeLow(): Promise<BigNumber>;
  standard(): Promise<BigNumber>;
  fast(): Promise<BigNumber>;
}


export class DefaultGasPricesOf implements GasPrices {

  constructor(private _aBlockchain: Blockchain, private _providers: any = providers) {}

  safeLow(): Promise<BigNumber> {
    return (new this._providers.JsonRpcProvider(this._aBlockchain.rpc())).getGasPrice();
  }

  standard(): Promise<BigNumber> {
    return this.safeLow();
  }

  fast(): Promise<BigNumber> {
    return this.safeLow();
  }
}
