import { InvestmentProduct } from './../../interfaces/investment-product.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InvestmentDataService {
  amount: number;
  quoteAmount: number;
  product: InvestmentProduct;

  constructor() {}
}
