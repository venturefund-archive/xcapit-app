import { Injectable } from '@angular/core';
import { FiatRampsService } from '../../../services/fiat-ramps.service';
import { DefaultMoonpayPrice } from '../default-moonpay-price';

@Injectable({ providedIn: 'root' })
export class DefaultMoonpayPriceFactory {
  public new(countryCode: string, currencyCode: string, fiatRamps: FiatRampsService): DefaultMoonpayPrice {
    return new DefaultMoonpayPrice(countryCode, currencyCode, fiatRamps);
  }
}
