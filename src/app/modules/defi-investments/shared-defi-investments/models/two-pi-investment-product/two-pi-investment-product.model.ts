import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Vault } from '@2pi-network/sdk';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { FixedNumber, BigNumber } from 'ethers';

export class TwoPiInvestmentProduct implements InvestmentProduct {
  private readonly vault: Vault;

  constructor(aVault: Vault, private apiWalletService: ApiWalletService) {
    this.vault = aVault;
  }

  name(): string {
    return this.vault.identifier;
  }

  token(): Coin {
    return this.apiWalletService.getCoins().find((token) => token.value === this.vault.token);
  }

  apy(): number {
    return this.vault.apy * 100;
  }

  type(): string {
    return 'Vault';
  }

  provider(): string {
    return '2PI';
  }

  tvl(): string {
    if (this.vault.tvl < Number.MAX_SAFE_INTEGER) {
      return FixedNumber.fromValue(BigNumber.from(this.vault.tvl), this.token().decimals, 'fixed')._value;
    } else {
      return this.vault.tvl.toString();
    }
  }
}
