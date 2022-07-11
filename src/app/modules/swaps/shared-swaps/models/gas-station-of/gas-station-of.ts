import { HttpClient } from "@angular/common/http";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../blockchain/blockchain";

export class GasStationOf {

  constructor(
    private _aBlockchain: Blockchain,
    private _httpClient: HttpClient | FakeHttpClient,
    private _providers: any = providers
  ) { }

  price(): GasPrice {
    let gasPrice: GasPrice = new DefaultGasPriceOf(this._aBlockchain, this._providers);
    if (this._aBlockchain.gasPriceClass()) {
      gasPrice = new PolygonGasPrice(this._httpClient);
    }
    return gasPrice;
  }
}
