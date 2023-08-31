import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Blockchain } from "src/app/modules/swaps/shared-swaps/models/blockchain/blockchain";
import { GasPrice } from "src/app/modules/swaps/shared-swaps/models/gas-price/gas-price";
import { WeiOf } from "src/app/modules/swaps/shared-swaps/models/wei-of/wei-of";
import { AmountOf } from "../blockchain-tx/amount-of/amount-of";


export class SolanaGasPrice implements GasPrice {

  constructor(private _aBlockchain: Blockchain, private _lamportsPerSol: number = LAMPORTS_PER_SOL) {}

  async safeLow(): Promise<AmountOf> {
    return this._defaultPrice();
  }

  async standard(): Promise<AmountOf> {
    return this._defaultPrice();
  }

  async fast(): Promise<AmountOf> {
    return this._defaultPrice();
  }

  private async _defaultPrice(): Promise<AmountOf> {
    return new AmountOf(
      new WeiOf(
        `${1 / this._lamportsPerSol}`,
        this._aBlockchain.nativeToken()
      ).value().toString(),
      this._aBlockchain.nativeToken()
    );
  }
}
