import { CovalentBalances } from '../balances/covalent-balances/covalent-balances';
import { TokenPrices } from '../token-prices/token-prices';
import { TokenDetail } from '../token-detail/token-detail';

export class TokenDetailList {
  constructor(private readonly tokenBalances: CovalentBalances, private readonly tokenPrices: TokenPrices) {}

  public async all(): Promise<any> {
    return Promise.all([this.tokenBalances.value(), this.tokenPrices.value()]).then(([balances, prices]) =>
      balances.reduce((result, balance) => {
        result.push(new TokenDetail(balance, prices[balance.coin.value]));
        return result;
      }, [])
    );
  }
}
