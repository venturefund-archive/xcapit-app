import { providers } from "ethers";
import { AmountOf } from "../../../../wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of";
import { Blockchain } from "../blockchain/blockchain";


export interface GasPrice {
  safeLow(): Promise<AmountOf>;
  standard(): Promise<AmountOf>;
  fast(): Promise<AmountOf>;
}


export class DefaultGasPriceOf implements GasPrice {

  constructor(private _aBlockchain: Blockchain, private _providers: any = providers) {}

  async safeLow(): Promise<AmountOf> {
    return new AmountOf(await this._gasPrice(), this._aBlockchain.nativeToken());
  }

  standard(): Promise<AmountOf> {
    return this.safeLow();
  }

  fast(): Promise<AmountOf> {
    return this.safeLow();
  }

  private async _gasPrice(): Promise<string> {
    return (await (new this._providers.JsonRpcProvider(this._aBlockchain.rpc())).getGasPrice()).toString();
  }
}
