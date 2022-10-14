import { HttpClient } from "@angular/common/http";
import { providers } from "ethers";
import { SolanaGasPrice } from "src/app/modules/wallets/shared-wallets/models/solana-gas-price/solana-gas-price";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../blockchain/blockchain";
import { DefaultGasPriceOf, GasPrice } from "../gas-price/gas-price";
import { PolygonGasPrice } from "../polygon-gas-price/polygon-gas-price";


export class GasStationOf {

  constructor(
    private _aBlockchain: Blockchain,
    private _httpClient: HttpClient | FakeHttpClient,
    private _providers: any = providers
  ) { }

  price(): GasPrice {
    return new Map<string, GasPrice>([
      ['SOLANA', new SolanaGasPrice(this._aBlockchain)],
      ['MATIC', new PolygonGasPrice(this._aBlockchain, this._httpClient)]
    ]).get(this._aBlockchain.name()) || new DefaultGasPriceOf(this._aBlockchain, this._providers);
  }
}
