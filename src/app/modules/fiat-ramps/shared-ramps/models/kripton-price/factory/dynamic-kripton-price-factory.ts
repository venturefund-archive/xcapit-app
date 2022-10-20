import { Injectable } from '@angular/core';
import { ProviderPrice } from '../../provider-price/provider-price';
import { DynamicKriptonPrice } from '../dynamic-kripton-price';

@Injectable({ providedIn: 'root' })
export class DynamicKriptonPriceFactory {
  public new(
    milliseconds: number,
    kriptonPrice: ProviderPrice
  ): DynamicKriptonPrice {
    return DynamicKriptonPrice.create(milliseconds, kriptonPrice);
  }
}
