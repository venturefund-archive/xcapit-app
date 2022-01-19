import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

export interface InvestmentProduct {
  id(): number;
  name(): string;
  token(): Coin;
  type(): string;
  provider(): string;
  apy(): number;
  tvl(): number;
}
