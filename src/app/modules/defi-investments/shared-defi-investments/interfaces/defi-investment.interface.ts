import { InvestmentProduct } from './investment-product.interface';

export interface DefiInvestment {
  product: InvestmentProduct;
  isComing: boolean;
  balance: number;
  weeklyEarning: boolean;
}
