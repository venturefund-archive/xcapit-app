import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../../blockchain/blockchain";
import { OneInch } from "../one-inch";


@Injectable({ providedIn: 'root' })
export class OneInchFactory {

  create(aBlockchain: Blockchain, httpClient: HttpClient | FakeHttpClient) {
    return new OneInch(aBlockchain, httpClient);
  }
}
