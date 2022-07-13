import { Injectable } from '@angular/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DynamicPrice } from '../dynamic-price.model';

@Injectable({ providedIn: 'root' })
export class DynamicPriceFactory {
  public new(
    milliseconds: number,
    _aCoin: Coin|any,
    _anApiWalletService: ApiWalletService,
  ): DynamicPrice {
    return DynamicPrice.create(milliseconds, _aCoin, _anApiWalletService);
  }
}
