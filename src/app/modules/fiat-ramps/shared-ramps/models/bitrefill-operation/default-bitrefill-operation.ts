import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { BlockchainTokens } from 'src/app/modules/swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { TokenByAddress } from 'src/app/modules/swaps/shared-swaps/models/token-by-address/token-by-address';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { Tokens } from 'src/app/modules/swaps/shared-swaps/models/tokens/tokens';

export interface BitrefillOperation {
  address(): string;
  paymentMethod(): string;
  amount(): Promise<AmountOf>;
  token(): Promise<Token>;
}

export class DefaultBitrefillOperation implements BitrefillOperation {
  constructor(
    private readonly _rawData: any,
    private readonly _tokens: Tokens,
    private readonly _blockchains: Blockchains
  ) {}

  address(): string {
    return this._isNative() ? this._rawData.paymentUri.split('@')[0].split(':')[1] : this._uriParams().get('address');
  }

  paymentMethod(): string {
    return this._rawData.paymentMethod;
  }

  async amount(): Promise<AmountOf> {
    const weiAmount = parseFloat(this._uriParams().get(this._isNative() ? 'value' : 'uint256'));
    return new AmountOf(weiAmount.toString(), await this.token());
  }

  async token(): Promise<Token> {
    return new TokenByAddress(this._tokenContract(), new BlockchainTokens(this._blockchain(), this._tokens)).value();
  }

  private _blockchain(): Blockchain {
    return this._blockchains.oneById(this._chainId());
  }

  private _uriParams(): URLSearchParams {
    return new URLSearchParams(this._rawData.paymentUri.split('?')[1]);
  }

  private _isNative(): boolean {
    return !this._rawData.paymentUri.includes('transfer?address=');
  }

  private _tokenContract(): string {
    return this._isNative()
      ? this._blockchain().nativeToken().address()
      : this._rawData.paymentUri.split('@')[0].split(':')[1];
  }

  private _chainId(): string {
    return this._rawData.paymentUri.split(this._isNative() ? '?' : '/')[0].split('@')[1];
  }
}
