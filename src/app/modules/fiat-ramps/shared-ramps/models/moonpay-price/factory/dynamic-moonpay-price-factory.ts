import { Injectable } from "@angular/core";
import { ProviderPrice } from "../../provider-price/provider-price";
import { DynamicMoonpayPrice } from "../dynamic-moonpay-price";

@Injectable({ providedIn: 'root' })
export class DynamicMoonpayPriceFactory {
  public new(
    miliseconds: number,
    moonpayPrice: ProviderPrice
  ): DynamicMoonpayPrice {
    return DynamicMoonpayPrice.create(miliseconds, moonpayPrice);
  }
}