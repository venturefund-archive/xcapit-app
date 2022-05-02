import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber, Signer, VoidSigner } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { DefaultERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { DefaultERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/default-erc20-token.model';
import { Coin } from '../../interfaces/coin.interface';
import { Send } from '../../interfaces/send.interface';
import { NetworkConfig } from '../network-config/network-config';

export class ERC20TokenSend implements Send {
  private _aFee: BigNumber;

  public get tokenDecimals(): number {
    return this._aCoin.decimals ? this._aCoin.decimals : 18;
  }

  private get amount(): BigNumber {
    return parseUnits(this._anAmount, this.tokenDecimals);
  }

  constructor(
    private readonly _anAddressTo: string,
    private readonly _anAmount: string,
    private readonly _aToken: DefaultERC20Token,
    private readonly _aCoin: Coin,
    public readonly canSignTx: boolean,
    private readonly networkConfig: NetworkConfig
  ) {}

  static create(
    to: string,
    amount: string,
    coin: Coin,
    signer: Signer,
    networkConfig: NetworkConfig
  ): ERC20TokenSend {
    const provider = new DefaultERC20Provider(coin);
    const canSignTx = !(signer instanceof VoidSigner);
    const contract = new ERC20Contract(provider, signer);
    const token = new DefaultERC20Token(contract);

    return new this(to, amount, token, coin, canSignTx, networkConfig);
  }

  async send(): Promise<TransactionResponse> {
    return this._aToken.transfer(this._anAddressTo, this.amount, await this.networkConfig.value());
  }
}
