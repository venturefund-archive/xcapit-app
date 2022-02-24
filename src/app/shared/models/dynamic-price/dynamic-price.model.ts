import { Coin } from '../../../modules/wallets/shared-wallets/interfaces/coin.interface';
import { Observable, timer } from 'rxjs';
import { ApiWalletService } from '../../../modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { map, mergeMap } from 'rxjs/operators';

export class DynamicPrice {
  constructor(
    private readonly _aTimer: Observable<number>,
    private readonly _aCoin: Coin,
    private readonly _anApiWalletService: ApiWalletService
  ) {}

  public static create(_milliseconds: number, _aCoin: Coin, _anApiWalletService: ApiWalletService): DynamicPrice {
    return new this(timer(0, _milliseconds), _aCoin, _anApiWalletService);
  }

  private price(): Observable<any> {
    return this._anApiWalletService.getPrices([this._aCoin.value], false);
  }

  value(): Observable<number> {
    return this._aTimer.pipe(
      mergeMap(() => this.price()),
      map((res) => res.prices[this._aCoin.value])
    );
  }
}
