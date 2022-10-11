import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs/internal/observable/timer';
import { mergeMap } from 'rxjs/operators';
import { DirectaPrice } from './default-directa-price';

export class DynamicDirectaPrice implements DirectaPrice {

  constructor(
    private readonly _timer: Observable<number>,
    private readonly _directaPrice: DirectaPrice
  ) {}

  public static create(
    _milliseconds: number,
    _directaPrice: DirectaPrice
  ): DynamicDirectaPrice {
    return new this(timer(0, _milliseconds), _directaPrice);
  }

  public value(): Observable<number> {
    return this._timer.pipe(
      mergeMap(() => this._directaPrice.value()),
    );
  }
}
