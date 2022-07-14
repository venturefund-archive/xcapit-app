import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Vault } from '@2pi-network/sdk';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { EquivalentTokenOf } from '../../../../wallets/shared-wallets/models/equivalent-token-of/equivalent-token-of';

export class TwoPiProduct implements InvestmentProduct {
  private readonly vault: Vault;

  constructor(aVault: Vault, private apiWalletService: ApiWalletService) {
    this.vault = aVault;
    this.apiWalletService = apiWalletService;
  }

  name(): string {
    return this.vault.identifier;
  }

  id(): number {
    return this.vault.pid;
  }

  token(): Coin {
    console.log('vault', this.valut);
    return this.apiWalletService
      .getCoins()
      .find((token) => token.value === new EquivalentTokenOf(this.vault.token).value());
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

  decimals(): number {
    return parseInt(this.vault.vaultDecimals);
  }

  tvl(): number {
    return this.vault.tvl / 10 ** this.decimals();
  }

  contractAddress(): string {
    return this.vault.address;
  }
}
