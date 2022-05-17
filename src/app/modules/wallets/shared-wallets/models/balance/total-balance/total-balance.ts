import { Prices } from '../../prices/prices.interface';
import { Balances } from '../../balances/balances.interface';
import { Balance } from '../balance.interface';

export class TotalBalance implements Balance {
  constructor(
    private readonly prices: Prices,
    private readonly balances: Balances,
    private readonly baseBalance: Balance
  ) {}

  private async accumulated(total: Promise<number>, item): Promise<number> {
    return (await total) + item.balance * (await this.prices.valueOf(item.coin));
  }

  private newBalance(): Promise<number> {
    return this.balances.value().then((res) => res.reduce(this.accumulated.bind(this), Promise.resolve(0)));
  }

  public async value(): Promise<number> {
    return (await this.baseBalance.value()) + (await this.newBalance());
  }
}
