import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { providers } from "ethers";
import { Blockchain } from "../../blockchain/blockchain";


@Injectable({ providedIn: 'root' })
export class GasStationOfFactory {

  create(
    _aBlockchain: Blockchain,
    _httpClient: HttpClient | FakeHttpClient,
    _providers: any = providers
  ): GasStationOf {
    return new GasStationOf(_aBlockchain, _httpClient, _providers);
  }
}
