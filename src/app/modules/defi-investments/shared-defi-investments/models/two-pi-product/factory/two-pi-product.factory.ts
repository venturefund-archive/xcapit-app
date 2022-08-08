import { Injectable } from '@angular/core';
import { ApiWalletService } from '../../../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiProduct } from '../two-pi-product.model';
import { Vault } from '@2pi-network/sdk';


@Injectable({ providedIn: 'root' })
export class TwoPiProductFactory {
  constructor(private apiWalletService: ApiWalletService) {}

  create(aVault: Vault, apiWalletService: ApiWalletService = this.apiWalletService): TwoPiProduct {
    return new TwoPiProduct(aVault, apiWalletService);
  }
}
