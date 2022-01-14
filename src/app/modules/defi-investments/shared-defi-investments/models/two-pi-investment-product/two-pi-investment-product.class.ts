import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Vault } from '@2pi-network/sdk';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { FixedNumber, BigNumber } from 'ethers';

export class TwoPiInvestmentProduct implements InvestmentProduct {
  name: string;
  vault: Vault;
  token: Coin;
  apy: number;
  tvl: any;
  type = 'Vault';
  provider = '2PI';

  constructor(aVault: Vault, private apiWalletService: ApiWalletService) {
    this.vault = aVault;
    this.name = aVault.id;
    this.token = this.setToken(aVault.token);
    this.apy = aVault.apy * 100;
    this.tvl = this.formatTVL(aVault.tvl);
  }

  private setToken(tokenName: string): Coin {
    return this.apiWalletService.getCoins().find((token) => token.value === tokenName);
  }

  private formatTVL(tvl: number): string {
    return FixedNumber.fromValue(BigNumber.from(tvl), this.token.decimals, 'fixed')._value;
  }
}
