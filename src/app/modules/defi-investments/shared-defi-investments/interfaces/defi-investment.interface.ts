import { InvestmentProduct } from './investment-product.interface';

export interface DefiInvestment {
  product: InvestmentProduct;
  isComing: boolean;
  balance: number;
  continuousEarning: boolean;
  category: string;
}
