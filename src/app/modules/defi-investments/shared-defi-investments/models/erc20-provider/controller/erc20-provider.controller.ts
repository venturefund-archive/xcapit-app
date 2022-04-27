import { Injectable } from '@angular/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { DefaultERC20Provider } from '../erc20-provider.model';

@Injectable({ providedIn: 'root' })
export class ERC20ProviderController {
  public new(_aCoin: Coin): DefaultERC20Provider {
    return new DefaultERC20Provider(_aCoin);
  }
}
