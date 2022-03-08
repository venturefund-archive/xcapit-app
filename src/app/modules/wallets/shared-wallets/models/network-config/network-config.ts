import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { TransactionRequest } from '@ethersproject/abstract-provider';

export class NetworkConfig {
  constructor(private readonly network: string, private readonly apiWalletService: ApiWalletService) {}

  async value(): Promise<TransactionRequest> {
    const gasPrice = (await this.apiWalletService.getGasPrice().toPromise()).gas_price;
    return this.network !== 'MATIC' ? {} : { gasPrice };
  }
}
