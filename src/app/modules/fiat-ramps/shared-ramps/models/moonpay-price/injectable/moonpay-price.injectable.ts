import { Injectable } from '@angular/core';
import { DefaultMoonpayPrice } from '../default-moonpay-price';
import { FiatRampsService } from '../../../services/fiat-ramps.service';
import { ProviderPrice } from '../../provider-price/provider-price';

@Injectable({ providedIn: 'root' })
export class MoonpayPriceInjectable {
  constructor(private fiatRampsService: FiatRampsService) {}

  create(currency: string, moonpayCode: string, fiatRampsService: FiatRampsService = this.fiatRampsService): ProviderPrice {
    return new DefaultMoonpayPrice(currency, moonpayCode, fiatRampsService);
  }
}
