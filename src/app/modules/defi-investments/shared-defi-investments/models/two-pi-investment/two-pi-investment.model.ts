import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { ERC20Contract } from '../erc20-contract/erc20-contract.model';
import { DefaultERC20Provider } from '../erc20-provider/erc20-provider.model';
import { DefaultERC20Token } from '../erc20-token/default-erc20-token.model';
import { TwoPiContract } from '../two-pi-contract/two-pi-contract.model';
import { environment } from '../../../../../../environments/environment';
import { TransactionResponse, TransactionReceipt } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import { Signer } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { Task } from '../../../../../shared/models/task/task';
import { Retry } from '../../../../../shared/models/retry/retry';

export interface Investment {
  balance(): Promise<number>;
  deposit(amount: number): Promise<TransactionResponse>;
  withdraw(amount: number): any;
  withdrawAll(): any;
  amountToShare(amount: number): Promise<BigNumber>;
}

export class TwoPiInvestment implements Investment {
  constructor(
    private readonly _aProduct: InvestmentProduct,
    private readonly _aWallet: Signer,
    private readonly _anErc20Token: DefaultERC20Token,
    private readonly _anErc20Provider: DefaultERC20Provider,
    private readonly _aTwoPiContract: TwoPiContract,
    private readonly _aReferralAddress: string,
    private readonly _anApiWalletService: ApiWalletService
  ) {}

  static create(
    _aProduct: InvestmentProduct,
    _aWallet: Signer,
    _anApiWalletService: ApiWalletService
  ): TwoPiInvestment {
    const erc20Provider = new DefaultERC20Provider(_aProduct.token());
    const erc20Token = new DefaultERC20Token(new ERC20Contract(erc20Provider, _aWallet));
    const twoPiContract = new TwoPiContract(_aProduct.contractAddress(), erc20Provider, _aWallet);
    const referralAddress = environment.twoPiReferralAddress;
    return new this(
      _aProduct,
      _aWallet,
      erc20Token,
      erc20Provider,
      twoPiContract,
      referralAddress,
      _anApiWalletService
    );
  }

  private _weiOf(amount: number): BigNumber {
    return parseUnits(amount.toFixed(this._aProduct.token().decimals), this._aProduct.token().decimals);
  }

  private async _approve(wei: BigNumber, gasPrice: BigNumber): Promise<TransactionReceipt> {
    return await (await this._anErc20Token.approve(this._aProduct.contractAddress(), wei, gasPrice)).wait();
  }

  private async _walletShares(): Promise<BigNumber> {
    return this._aTwoPiContract.value().balanceOf(this._aProduct.id(), await this._aWallet.getAddress());
  }

  private _sharePrice(): Promise<BigNumber> {
    return this._aTwoPiContract.value().getPricePerFullShare(this._aProduct.id());
  }

  public async amountToShare(amount: number): Promise<BigNumber> {
    return this._weiOf(amount)
      .mul(BigNumber.from('10').pow(this._aProduct.token().decimals))
      .div(await this._sharePrice());
  }

  private _tokenValueOf(aWei: BigNumber) {
    return parseFloat(formatUnits(aWei.toString(), this._aProduct.decimals() + this._aProduct.token().decimals));
  }

  private async _gasPrice(): Promise<BigNumber> {
    return BigNumber.from(
      await this._anApiWalletService
        .getGasPrice()
        .toPromise()
        .then((res) => res.gas_price)
    );
  }

  async balance(): Promise<number> {
    return this._tokenValueOf((await this._walletShares()).mul(await this._sharePrice()));
  }

  async deposit(amount: number): Promise<TransactionResponse> {
    const gasPrice = await this._gasPrice();
    await this._approve(this._weiOf(amount), gasPrice);
    return new Retry(
      new Task(() =>
        this._aTwoPiContract
          .value()
          .deposit(this._aProduct.id(), this._weiOf(amount), this._aReferralAddress, { gasPrice })
      )
    )
      .execute()
      .toPromise();
  }

  async withdraw(amount: number): Promise<TransactionResponse> {
    const gasPrice = await this._gasPrice();
    return this._aTwoPiContract.value().withdraw(this._aProduct.id(), this.amountToShare(amount), { gasPrice });
  }

  async withdrawAll(): Promise<TransactionResponse> {
    const gasPrice = await this._gasPrice();
    return this._aTwoPiContract.value().withdrawAll(this._aProduct.id(), { gasPrice });
  }
}
