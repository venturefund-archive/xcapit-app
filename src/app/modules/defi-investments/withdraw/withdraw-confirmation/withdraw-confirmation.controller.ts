import { Injectable } from '@angular/core';
import { Contract, Signer } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { Fee } from '../../shared-defi-investments/interfaces/fee.interface';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { ERC20Provider } from '../../shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { FormattedFee } from '../../shared-defi-investments/models/formatted-fee/formatted-fee.model';
import { GasFeeOf } from '../../shared-defi-investments/models/gas-fee-of/gas-fee-of.model';
import { TwoPiContract } from '../../shared-defi-investments/models/two-pi-contract/two-pi-contract.model';
import {
  Investment,
  TwoPiInvestment,
} from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';

@Injectable({
  providedIn: 'root',
})
export class WithdrawConfirmationController {
  constructor() {}

  createDynamicPrice(priceRefreshInterval: number, token: Coin, apiWalletService: ApiWalletService): DynamicPrice {
    return DynamicPrice.create(priceRefreshInterval, token, apiWalletService);
  }

  createGasFeeOf(contract: Contract, methodName: string, args: any[]): Fee {
    return new GasFeeOf(contract, methodName, args);
  }

  async withdrawFeeContract(
    investmentProduct: InvestmentProduct,
    erc20Provider: ERC20Provider,
    signer: Signer
  ): Promise<TwoPiContract> {
    return new TwoPiContract(investmentProduct.contractAddress(), erc20Provider, signer);
  }

  createErc20Provider(token: Coin): ERC20Provider {
    return new ERC20Provider(token);
  }

  investment(investmentProduct: InvestmentProduct, signer: Signer, apiWalletService: ApiWalletService): Investment {
    return TwoPiInvestment.create(investmentProduct, signer, apiWalletService);
  }

  createFormattedFee(fee: Fee): FormattedFee {
    return new FormattedFee(fee);
  }
}
