import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Vault } from '@2pi-network/sdk';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';

export class TwoPiInvestmentProduct implements InvestmentProduct {
  private readonly vault: Vault;

  constructor(aVault: Vault, private apiWalletService: ApiWalletService) {
    this.vault = aVault;
  }

  name(): string {
    return this.vault.identifier;
  }

  id(): number {
    return this.vault.pid;
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

  private tokenDecimals(): number {
    return this.vault.tokenDecimals;
  }

  tvl(): number {
    return this.vault.tvl / 10 ** this.tokenDecimals();
  }

  contractAddress(): string {
      return this.vault.address;
  }
}
