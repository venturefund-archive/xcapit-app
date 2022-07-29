import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { providers } from "ethers";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../../blockchain/blockchain";
import { GasStationOf } from "../gas-station-of";


@Injectable({ providedIn: 'root' })
export class GasStationOfFactory {

  constructor(private httpClient: HttpClient) { }

  create(
    _aBlockchain: Blockchain,
    _httpClient: HttpClient | FakeHttpClient = this.httpClient,
    _providers: any = providers
  ): GasStationOf {
    return new GasStationOf(_aBlockchain, _httpClient, _providers);
  }
}
