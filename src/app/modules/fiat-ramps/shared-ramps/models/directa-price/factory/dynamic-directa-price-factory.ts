import { Injectable } from "@angular/core";
import { ProviderPrice } from "../../provider-price/provider-price";
import { DynamicDirectaPrice } from "../dynamic-directa-price";

@Injectable({ providedIn: 'root' })
export class DynamicDirectaPriceFactory {
  public new(
    miliseconds: number,
    directaPrice: ProviderPrice
  ): DynamicDirectaPrice {
    return DynamicDirectaPrice.create(miliseconds, directaPrice);
  }
}
