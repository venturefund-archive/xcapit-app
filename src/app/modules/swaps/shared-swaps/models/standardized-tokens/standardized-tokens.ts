import { DefaultToken, Token } from "../token/token";
import { TokenRepo } from "../token-repo/token-repo";
import { Tokens } from "../tokens/tokens";


export class StandardizedTokens implements Tokens {

  private _standardNativeAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

  constructor(private _dataRepo: TokenRepo) { }

  async value(): Promise<Token[]> {
    return this._dataRepo.all().map(item => {
      const i = { ...item };
      if (i['native']) {
        i['contract'] = this._standardNativeAddress;
      }
      return new DefaultToken(i);
    }, this);
  }
}
