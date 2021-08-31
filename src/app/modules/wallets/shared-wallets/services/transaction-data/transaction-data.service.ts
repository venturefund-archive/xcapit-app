import { Injectable } from '@angular/core';
import { SummaryData } from '../../../send/send-summary/interfaces/summary-data.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionDataService {
  transactionData: SummaryData;

  constructor() {}
}
