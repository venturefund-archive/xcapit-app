import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber, Signer, VoidSigner, Wallet } from 'ethers';
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { Amount } from 'src/app/modules/defi-investments/shared-defi-investments/types/amount.type';
import { Coin } from '../../interfaces/coin.interface';
import { Send } from '../../interfaces/send.interface';
import { NativeToken } from '../native-token/native-token.model';
import { NetworkConfig } from '../network-config/network-config';

export class NativeTokenSend implements Send {
  private _aFee: BigNumber;

  get fee(): BigNumber {
    return this._aFee;
  }

  get tokenDecimals(): number {
    return this._aCoin.decimals ? this._aCoin.decimals : 18;
  }

  private get amount(): BigNumber {
    return parseUnits(this._anAmount, this.tokenDecimals);
  }

  constructor(
    private readonly _anAddressFrom: string,
    private readonly _anAddressTo: string,
    private readonly _anAmount: string,
    private readonly _aToken: NativeToken,
    private readonly _aCoin: Coin,
    public readonly canSignTx: boolean,
    private readonly networkConfig: NetworkConfig
  ) {}

  static create(
    from: string,
    to: string,
    amount: string,
    coin: Coin,
    signer: Signer,
    networkConfig: NetworkConfig
  ): NativeTokenSend {
    const provider = new ERC20Provider(coin);
    const canSignTx = !(signer instanceof VoidSigner);
    const _aToken = new NativeToken(provider, signer);

    return new this(from, to, amount, _aToken, coin, canSignTx, networkConfig);
  }

  async send(): Promise<TransactionResponse> {
    return this._aToken.transfer(this._anAddressTo, this.amount, await this.networkConfig.value());
  }

  sendEstimateGas(): Promise<BigNumber> {
    return this._aToken.transferFee(this._anAddressTo, this.amount);
  }

  getGasPrice(): Promise<BigNumber> {
    return this._aToken.getGasPrice();
  }

  sendEstimateFee(): Promise<BigNumber> {
    const gasPrice = this.getGasPrice();
    const gasFee = this.sendEstimateGas();

    return Promise.all([gasPrice, gasFee]).then((values) => {
      this._aFee = values[0].mul(values[1]);
      return this._aFee;
    });
  }

  formatFee(): string {
    return formatUnits(this.fee, this.tokenDecimals);
  }
}
