import { Token, DefaultToken } from "../token/token";
import { TokenRepo } from "../token-repo/token-repo";


export interface Tokens {

  value(): Promise<Token[]>;
}


export class DefaultTokens implements Tokens {

  constructor(private _dataRepo: TokenRepo){ }

  async value(): Promise<Token[]> {
    return this._dataRepo.all().map(item => (new DefaultToken(item)));
  }
}
