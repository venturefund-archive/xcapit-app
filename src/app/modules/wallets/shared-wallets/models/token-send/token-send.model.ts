import { Signer, VoidSigner } from 'ethers';
import { Coin } from '../../interfaces/coin.interface';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { ERC20TokenSend } from '../erc20-token-send/erc20-token-send.model';
import { NativeTokenSend } from '../native-token-send/native-token-send.model';
import { NetworkConfig } from '../network-config/network-config';

export class TokenSend {
  constructor(
    private readonly from: string,
    private readonly to: string,
    private readonly amount: string,
    private readonly coin: Coin,
    private readonly apiWalletService: ApiWalletService,
    private readonly signer: Signer,
    private readonly networkConfig: NetworkConfig
  ) {}

  static create(
    from: string,
    to: string,
    amount: string,
    coin: Coin,
    apiWalletService: ApiWalletService,
    networkConfig: NetworkConfig
  ): TokenSend {
    return new this(from, to, amount, coin, apiWalletService, new VoidSigner(from), networkConfig);
  }

  value(): NativeTokenSend | ERC20TokenSend {
    if (this.coin.native) {
      return NativeTokenSend.create(this.from, this.to, this.amount, this.coin, this.signer, this.networkConfig);
    } else {
      const nativeCoin = this.apiWalletService.getNativeTokenFromNetwork(this.coin.network);
      return ERC20TokenSend.create(
        this.from,
        this.to,
        this.amount,
        this.coin,
        nativeCoin,
        this.signer,
        this.networkConfig
      );
    }
  }
}
