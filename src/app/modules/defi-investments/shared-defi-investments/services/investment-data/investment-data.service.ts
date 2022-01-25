import { Injectable } from '@angular/core';
import { Investment } from '../../models/two-pi-investment/two-pi-investment.model';

@Injectable({
  providedIn: 'root',
})
export class InvestmentDataService {
  amount: number;
  quoteAmount: number;
  investment: Investment;

  constructor() {}
}
