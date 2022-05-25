import { Injectable } from '@angular/core';
import { Signer } from 'ethers';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { InvestmentProduct } from '../../../interfaces/investment-product.interface';
import { TwoPiInvestment } from '../two-pi-investment.model';

@Injectable({ providedIn: 'root' })
export class TwoPiInvestmentFactory {
  public new(
    _anInvestmentProduct: InvestmentProduct,
    _aSigner: Signer,
    _anApiWalletService: ApiWalletService
  ): TwoPiInvestment {
    return TwoPiInvestment.create(_anInvestmentProduct, _aSigner, _anApiWalletService);
  }
}
