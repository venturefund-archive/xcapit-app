import { Injectable } from "@angular/core";
import { DirectaPrice } from "../default-directa-price";
import { DynamicDirectaPrice } from "../dynamic-directa-price";

@Injectable({ providedIn: 'root' })
export class DynamicDirectaPriceFactory {
  public new(
    miliseconds: number,
    directaPrice: DirectaPrice
  ): DynamicDirectaPrice {
    return DynamicDirectaPrice.create(miliseconds, directaPrice);
  }
}
