import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber, VoidSigner, Wallet } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { ERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/erc20-token.model';
import { Coin } from '../../interfaces/coin.interface';
import { Send } from '../../interfaces/send.interface';

export class ERC20TokenSend implements Send {
  private _aFee: BigNumber;

  public get fee(): BigNumber { 
    return this._aFee;
  }

  public get tokenDecimals(): number {
    return this._aCoin.decimals ? this._aCoin.decimals : 18;
  }

  public get nativeTokenDecimals(): number {
    return this._aNativeCoin.decimals ? this._aNativeCoin.decimals : 18;
  }

  private get amount(): BigNumber {
    return parseUnits(this._anAmount, this.tokenDecimals);
  }

  constructor(
    private readonly _anAddressFrom: string,
    private readonly _anAddressTo: string,
    private readonly _anAmount: string,
    private readonly _aToken: ERC20Token,
    private readonly _aCoin: Coin,
    private readonly _aNativeCoin: Coin,
    public readonly canSignTx: boolean,
  ) {}

  static create(from: string, to: string, amount: string, coin: Coin, nativeCoin: Coin, wallet?: Wallet): ERC20TokenSend {
    const provider = new ERC20Provider(coin);
    const signer = wallet ? wallet : new VoidSigner(from);
    const canSignTx = wallet ? true : false;
    const contract = new ERC20Contract(provider, signer);
    const token = new ERC20Token(contract);

    return new this(from, to, amount, token, coin, nativeCoin, canSignTx);
  }

  send(): Promise<TransactionResponse> {
    return this._aToken.transfer(this._anAddressTo, this.amount);
  }

  async sendEstimateGas(): Promise<BigNumber> {
    return (await this.hasEnoughBalanceToCoverAmount()) ? this.sendEstimateGasWithSelectedAmount() : this.sendEstimateGasWithAmountZero();
  }

  private sendEstimateGasWithSelectedAmount(): Promise<BigNumber> {
    return this._aToken.transferFee(this._anAddressTo, this.amount);
  }

  private sendEstimateGasWithAmountZero(): Promise<BigNumber> {
    return this._aToken.transferFee(this._anAddressTo, BigNumber.from(0));
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
    return formatUnits(this.fee, this.nativeTokenDecimals);
  }

  private async hasEnoughBalanceToCoverAmount(): Promise<boolean> {
    return (await this.getBalance()).gte(this.amount);
  }

  private getBalance(): Promise<BigNumber> {
    return this._aToken.balanceOf(this._anAddressFrom);
  }
}
