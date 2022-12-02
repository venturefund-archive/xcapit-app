import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";

export type RawToken = {
  id?: number;
  name?: string;
  logoRoute?: string;
  value: string;
  network: string;
  chainId: number;
  rpc?: string;
  contract: string;
  abi?: any;
  decimals: number;
  selected?: boolean;
  native?: boolean;
  symbol?: string;
  moonpayCode?: string;
}


export class TokenRepo {

  constructor(private _rawData: RawToken[]|Coin[]) { }

  all(): RawToken[]|Coin[] {
    return this._rawData;
  }
}
