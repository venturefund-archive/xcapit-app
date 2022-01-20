import { ApiWalletService } from './../../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Vault } from '@2pi-network/sdk';
import { InvestmentProduct } from './../../interfaces/investment-product.interface';
import { TwoPiInvestmentProduct } from './../../models/two-pi-investment-product/two-pi-investment-product.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TwoPiInvestmentService {
  // amount: number;
  amount = 25;
  // quoteAmount: number;
  quoteAmount = 25;
  product: InvestmentProduct;

  constructor(private apiWalletService: ApiWalletService) {
    this.product = new TwoPiInvestmentProduct(
      {
        apy: 0.12392847454895217,
        identifier: 'polygon_usdc',
        token: 'USDC',
        tvl: '15800500',
        tokenDecimals: '6',
        pid: 2,
      } as Vault,
      apiWalletService
    );
  }
}
