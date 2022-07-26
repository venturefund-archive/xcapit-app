import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../../blockchain/blockchain";
import { OneInch } from "../one-inch";


@Injectable({ providedIn: 'root' })
export class OneInchFactory {

  constructor(private httpClient: HttpClient) { }

  create(_aBlockchain: Blockchain, _httpClient: HttpClient | FakeHttpClient = this.httpClient) {
    return new OneInch(_aBlockchain, _httpClient);
  }
}
