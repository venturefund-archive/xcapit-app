import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs/internal/observable/timer';
import { mergeMap } from 'rxjs/operators';
import { ProviderPrice } from '../provider-price/provider-price';

export class DynamicDirectaPrice implements ProviderPrice {

  constructor(
    private readonly _timer: Observable<number>,
    private readonly _directaPrice: ProviderPrice
  ) {}

  public static create(
    _milliseconds: number,
    _directaPrice: ProviderPrice
  ): DynamicDirectaPrice {
    return new this(timer(0, _milliseconds), _directaPrice);
  }

  public value(): Observable<number> {
    return this._timer.pipe(
      mergeMap(() => this._directaPrice.value()),
    );
  }
}
