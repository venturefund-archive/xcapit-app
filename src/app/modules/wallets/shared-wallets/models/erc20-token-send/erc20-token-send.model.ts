import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber, constants, VoidSigner, Wallet } from 'ethers';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { ERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/erc20-token.model';
import { Amount } from 'src/app/modules/defi-investments/shared-defi-investments/types/amount.type';
import { NONPROD_COINS } from '../../constants/coins.nonprod';
import { Coin } from '../../interfaces/coin.interface';
import { Send } from '../../interfaces/send.interface';

export class ERC20TokenSend implements Send {
  constructor(
    private readonly _anAddressFrom: string,
    private readonly _anAddressTo: string,
    private readonly _anAmount: Amount,
    private readonly _aToken: ERC20Token,
    public readonly canSignTx: boolean
  ) {}

  static create(from: string, to: string, amount: number, coin: Coin, wallet?: Wallet): ERC20TokenSend {
    const provider = new ERC20Provider(coin);
    const signer = wallet ? wallet : new VoidSigner(from);
    const canSignTx = wallet ? true : false;
    const contract = new ERC20Contract(provider, signer);
    const token = new ERC20Token(contract);
    const _anAmount = { value: amount, token: coin.name };

    return new this(from, to, _anAmount, token, canSignTx);
  }

  send(): Promise<string | TransactionResponse> {
    return this._aToken.transfer(this._anAddressTo, BigNumber.from(this._anAmount.value));
  }

  sendEstimateGas(): Promise<BigNumber> {
    return this._aToken.transferFee(this._anAddressTo, BigNumber.from(this._anAmount.value));
  }

  sendEstimateGasWithAmountZero(): Promise<BigNumber> {
    return this._aToken.transferFee(this._anAddressTo, BigNumber.from(0));
  }
}
