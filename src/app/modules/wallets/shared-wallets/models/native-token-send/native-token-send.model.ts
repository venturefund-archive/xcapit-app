import { TransactionResponse } from '@ethersproject/abstract-provider';
import { Signer, VoidSigner } from 'ethers';
import { DefaultERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { Coin } from '../../interfaces/coin.interface';
import { Send } from '../../interfaces/send.interface';
import { NativeToken } from '../native-token/native-token.model';
import { NetworkConfig } from '../network-config/network-config';
import { WeiOf } from '../../../../../shared/models/wei-of/wei-of';

export class NativeTokenSend implements Send {
  get tokenDecimals(): number {
    return this._aCoin.decimals ? this._aCoin.decimals : 18;
  }

  constructor(
    private readonly _anAddressTo: string,
    private readonly _anAmount: number,
    private readonly _aToken: NativeToken,
    private readonly _aCoin: Coin,
    public readonly canSignTx: boolean,
    private readonly networkConfig: NetworkConfig
  ) {}

  static create(to: string, amount: number, coin: Coin, signer: Signer, networkConfig: NetworkConfig): NativeTokenSend {
    const provider = new DefaultERC20Provider(coin);
    const canSignTx = !(signer instanceof VoidSigner);
    const _aToken = new NativeToken(provider, signer);

    return new this(to, amount, _aToken, coin, canSignTx, networkConfig);
  }

  async send(): Promise<TransactionResponse> {
    return this._aToken.transfer(
      this._anAddressTo,
      new WeiOf(this._anAmount, this._aCoin).value(),
      await this.networkConfig.value()
    );
  }
}
