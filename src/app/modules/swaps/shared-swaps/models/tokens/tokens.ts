import { Token, DefaultToken } from "../token/token";
import { TokenRepo } from "../token-repo/token-repo";
import { SolanaToken } from "../token/solana/solana-token";


export interface Tokens {

  value(): Promise<Token[]>;
}


export class DefaultTokens implements Tokens {

  constructor(private _dataRepo: TokenRepo){ }

  async value(): Promise<Token[]> {
    return this._dataRepo.all().map(item => {
      return item.network === 'SOLANA' ?
        new SolanaToken(item) : new DefaultToken(item);
    });
  }
}
