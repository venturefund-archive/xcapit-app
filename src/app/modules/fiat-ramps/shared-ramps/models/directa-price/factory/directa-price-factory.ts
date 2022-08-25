import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { FiatRampsService } from "../../../services/fiat-ramps.service";
import { DirectaPrice } from "../directa-price";

@Injectable({ providedIn: 'root' })
export class DirectaPriceFactory {
  public new(
    miliseconds: number,
    fiatCurrency: string,
    cryptoCurrency: Coin,
    http: HttpClient | FakeHttpClient,
    fiatRamps: FiatRampsService
  ): DirectaPrice {
    return DirectaPrice.create(miliseconds, fiatCurrency, cryptoCurrency, http, fiatRamps);
  }
}