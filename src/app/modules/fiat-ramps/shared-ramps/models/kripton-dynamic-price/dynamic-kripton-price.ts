import { Observable, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { KriptonPrice } from './default-kripton-price';

export class DynamicKriptonPrice {
  constructor(private readonly _timer: Observable<number>, private readonly _kriptonPrice: KriptonPrice) {}

  public static create(_milliseconds: number, _kriptonPrice: KriptonPrice): DynamicKriptonPrice {
    return new this(timer(0, _milliseconds), _kriptonPrice);
  }

  public value(): Observable<number> {
    return this._timer.pipe(mergeMap(() => this._kriptonPrice.value()));
  }
}
