import { Injectable } from "@angular/core";
import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";
import { FiatRampsService } from "../../../services/fiat-ramps.service";
import { DefaultDirectaPrice, DirectaPrice } from "../default-directa-price";

@Injectable({ providedIn: 'root' })
export class DefaultDirectaPriceFactory {
  public new(
     fiatCurrency: string,
     cryptoCurrency: Coin,
     fiatRamps: FiatRampsService
  ): DefaultDirectaPrice {
    return new DefaultDirectaPrice(fiatCurrency, cryptoCurrency, fiatRamps);
  }
}
