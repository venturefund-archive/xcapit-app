import { HttpClient } from "@angular/common/http";
import { providers } from "ethers";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../blockchain/blockchain";
import { DefaultGasPricesOf, GasPrices } from "../gas-price/gas-price";
import { PolygonGasPrices } from "../polygon-gas-price/polygon-gas-price";


export class GasStationOf {

  constructor(
    private _aBlockchain: Blockchain,
    private _httpClient: HttpClient | FakeHttpClient,
    private _providers: any = providers
  ) { }

  prices(): GasPrices {
    let gasPrice: GasPrices = new DefaultGasPricesOf(this._aBlockchain, this._providers);
    if (this._aBlockchain.gasPriceClass()) {
      gasPrice = new PolygonGasPrices(this._httpClient);
    }
    return gasPrice;
  }
}
