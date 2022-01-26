import { StorageService } from '../../../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { BlockchainProviderService } from '../../../../wallets/shared-wallets/services/blockchain-provider/blockchain-provider.service';
import { TwoPiContract } from '../../services/two-pi-contract/two-pi-contract.service';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Vault } from '@2pi-network/sdk';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { Contract } from 'ethers';

export class TwoPiProduct implements InvestmentProduct {
  private readonly vault: Vault;

  constructor(
    aVault: Vault,
    private apiWalletService: ApiWalletService,
    private blockchainProviderService: BlockchainProviderService,
    private storageService: StorageService
  ) {
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

  contract(): Contract {
    return new TwoPiContract(this.blockchainProviderService, this.storageService).valueOf(this.vault);
  }
}
