import { Injectable } from '@angular/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ERC20Provider } from '../erc20-provider.interface';
import { DefaultERC20Provider } from '../erc20-provider.model';

@Injectable({ providedIn: 'root' })
export class ERC20ProviderController {
  public new(_aCoin: Coin): ERC20Provider {
    return new DefaultERC20Provider(_aCoin);
  }
}
