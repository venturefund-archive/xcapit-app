import { TwoPiInvestmentProduct } from './../../models/two-pi-investment-product/two-pi-investment-product.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TwoPiInvestmentService {
  amount: number;
  quoteAmount: number;
  product: TwoPiInvestmentProduct;
  constructor() {}
}
