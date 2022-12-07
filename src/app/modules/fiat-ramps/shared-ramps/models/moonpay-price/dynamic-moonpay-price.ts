import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs/internal/observable/timer';
import { mergeMap } from 'rxjs/operators';
import { ProviderPrice } from '../provider-price/provider-price';

export class DynamicMoonpayPrice implements ProviderPrice {

  constructor(
    private readonly _timer: Observable<number>,
    private readonly _moonpayPrice: ProviderPrice
  ) {}

  public static create(
    _milliseconds: number,
    _moonpayPrice: ProviderPrice
  ): DynamicMoonpayPrice {
    return new this(timer(0, _milliseconds), _moonpayPrice);
  }

  public value(): Observable<number> {
    return this._timer.pipe(
      mergeMap(() => this._moonpayPrice.value()),
    );
  }
}