import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { ERC20Contract } from '../erc20-contract/erc20-contract.model';
import { ERC20Provider } from '../erc20-provider/erc20-provider.model';
import { ERC20Token } from '../erc20-token/erc20-token.model';
import { TwoPiContract } from '../two-pi-contract/two-pi-contract.model';
import { environment } from '../../../../../../environments/environment';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import { Signer } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

export interface Investment {
  balance(): Promise<number>;
  deposit(amount: number): Promise<TransactionResponse>;
  withdraw(): any;
}

export class TwoPiInvestment implements Investment {
  constructor(
    private readonly _aProduct: InvestmentProduct,
    private readonly _aWallet: Signer,
    private readonly _anErc20Token: ERC20Token,
    private readonly _anErc20Provider: ERC20Provider,
    private readonly _aTwoPiContract: TwoPiContract,
    private readonly _aReferralAddress: string
  ) {}

  static create(_aProduct: InvestmentProduct, _aWallet: Signer): TwoPiInvestment {
    const erc20Provider = new ERC20Provider(_aProduct.token());
    const erc20Token = new ERC20Token(new ERC20Contract(erc20Provider, _aWallet));
    const twoPiContract = new TwoPiContract(_aProduct.contractAddress(), erc20Provider, _aWallet);
    const referralAddress = environment.twoPiReferralAddress;
    return new this(_aProduct, _aWallet, erc20Token, erc20Provider, twoPiContract, referralAddress);
  }

  private _weiOf(amount: number): BigNumber {
    return parseUnits(amount.toString(), this._aProduct.token().decimals);
  }

  private _approve(wei: BigNumber): Promise<string | TransactionResponse> {
    return this._anErc20Token.approve(this._aProduct.contractAddress(), wei);
  }

  private async _walletShares(): Promise<BigNumber> {
    return this._aTwoPiContract.value().balanceOf(this._aProduct.id(), await this._aWallet.getAddress());
  }

  private _sharePrice(): Promise<BigNumber> {
    return this._aTwoPiContract.value().getPricePerFullShare(this._aProduct.id());
  }

  private _tokenValueOf(aWei: BigNumber) {
    return parseFloat(formatUnits(aWei.toString(), this._aProduct.decimals() + this._aProduct.token().decimals));
  }

  async balance(): Promise<number> {
    return this._tokenValueOf((await this._walletShares()).mul(await this._sharePrice()));
  }

  async deposit(amount: number): Promise<TransactionResponse> {
    await this._approve(this._weiOf(amount));
    return this._aTwoPiContract.value().deposit(this._aProduct.id(), this._weiOf(amount), this._aReferralAddress);
  }

  withdraw(): Promise<TransactionResponse> {
    return this._aTwoPiContract.value().withdrawAll(this._aProduct.id());
  }
}
