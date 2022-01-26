import { ethers, Wallet } from 'ethers';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { ERC20Contract } from '../erc20-contract/erc20-contract.model';
import { ERC20Provider } from '../erc20-provider/erc20-provider.model';
import { ERC20Token } from '../erc20-token/erc20-token.model';
import { TwoPiContract } from '../two-pi-contract/two-pi-contract.model';
import { environment } from '../../../../../../environments/environment';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';

export interface Investment {
  balance(): number;
  deposit(amount: number): any;
  withdraw(): any;
}

export class TwoPiInvestment implements Investment {
  constructor(
    private readonly _aProduct: InvestmentProduct,
    private readonly _aWallet: Wallet,
    private readonly _anErc20Token: ERC20Token,
    private readonly _anErc20Provider: ERC20Provider,
    private readonly _aTwoPiContract: TwoPiContract,
    private readonly _aReferralAddress: string
  ) {}

  static create(_aProduct: InvestmentProduct, _aWallet: Wallet): TwoPiInvestment {
    const erc20Provider = new ERC20Provider(_aProduct.token());
    const erc20Token = new ERC20Token(new ERC20Contract(erc20Provider, _aWallet));
    const twoPiContract = new TwoPiContract(_aProduct.contractAddress(), erc20Provider, _aWallet);
    const referralAddress = environment.twoPiReferralAddress;
    return new this(_aProduct, _aWallet, erc20Token, erc20Provider, twoPiContract, referralAddress);
  }

  private _weiOf(amount: number): BigNumber {
    return ethers.utils.parseUnits(amount.toString(), this._aProduct.token().decimals);
  }

  private _approve(wei: BigNumber): Promise<string | TransactionResponse> {
    return this._anErc20Token.approve(this._aProduct.contractAddress(), wei);
  }

  balance(): number {
    // const contract = this.createContract(product);
    // const wallets = await this.storageService.getWalletFromStorage();
    // return parseInt(await contract.balanceOf(product.id(), wallets.addresses.MATIC));
    return;
  }

  async deposit(amount: number): Promise<TransactionResponse> {
    await this._approve(this._weiOf(amount));
    return this._aTwoPiContract.value().deposit(this._aProduct.id(), this._weiOf(amount), this._aReferralAddress);
  }

  withdraw(): any {
    return;
  }
}
