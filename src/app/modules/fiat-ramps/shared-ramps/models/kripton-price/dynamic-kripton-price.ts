import { Observable, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ProviderPrice } from '../provider-price/provider-price';

export class DynamicKriptonPrice {
  constructor(private readonly _timer: Observable<number>, private readonly _kriptonPrice: ProviderPrice) {}

  public static create(_milliseconds: number, _kriptonPrice: ProviderPrice): DynamicKriptonPrice {
    return new this(timer(0, _milliseconds), _kriptonPrice);
  }

  public value(): Observable<number> {
    return this._timer.pipe(mergeMap(() => this._kriptonPrice.value()));
  }
}
