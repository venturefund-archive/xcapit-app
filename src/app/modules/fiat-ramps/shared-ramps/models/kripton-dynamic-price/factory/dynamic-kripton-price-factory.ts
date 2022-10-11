import { Injectable } from '@angular/core';
import { DynamicKriptonPrice } from '../dynamic-kripton-price';
import { KriptonPrice } from '../default-kripton-price';

@Injectable({ providedIn: 'root' })
export class DynamicKriptonPriceFactory {
  public new(
    milliseconds: number,
    kriptonPrice: KriptonPrice
  ): DynamicKriptonPrice {
    return DynamicKriptonPrice.create(milliseconds, kriptonPrice);
  }
}
