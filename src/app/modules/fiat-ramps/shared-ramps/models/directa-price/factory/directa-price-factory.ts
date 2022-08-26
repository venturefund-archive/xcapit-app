import { Injectable } from "@angular/core";
import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";
import { FiatRampsService } from "../../../services/fiat-ramps.service";
import { DirectaPrice } from "../directa-price";

@Injectable({ providedIn: 'root' })
export class DirectaPriceFactory {
  public new(
    miliseconds: number,
    fiatCurrency: string,
    cryptoCurrency: Coin,
    fiatRamps: FiatRampsService
  ): DirectaPrice {
    return DirectaPrice.create(miliseconds, fiatCurrency, cryptoCurrency, fiatRamps);
  }
}