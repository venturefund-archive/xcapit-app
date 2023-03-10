import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { Tokens } from 'src/app/modules/swaps/shared-swaps/models/tokens/tokens';

export interface BitrefillOperation {
  address(): string;
  paymentMethod(): string;
  amount(): number;
  token(): Promise<Token>;
}

export class DefaultBitrefillOperation implements BitrefillOperation {
  constructor(
    private readonly _rawData: any,
    private readonly _tokens: Tokens,
  ) {}

  address(): string {
    return this._rawData.paymentUri.split('?')[0].split(':')[1];
  }

  paymentMethod(): string {
    return this._rawData.paymentMethod;
  }

  amount(): number {
    return parseFloat(this._uriParams().get('amount'));
  }

  async token(): Promise<Token> {
    const tokens : Token[] = await this._tokens.value()
    return tokens.find((token) => {
      return token.json().bitrefillCode === this.paymentMethod();
    });
  }

  private _uriParams(): URLSearchParams {
    return new URLSearchParams(this._rawData.paymentUri.split('?')[1]);
  }
}
