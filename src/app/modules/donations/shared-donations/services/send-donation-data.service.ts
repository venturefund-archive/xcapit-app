import { Injectable } from '@angular/core';
import { SummaryData } from 'src/app/modules/wallets/send/send-summary/interfaces/summary-data.interface';

@Injectable({
  providedIn: 'root',
})
export class SendDonationDataService {
  data: SummaryData;
  cause: string;

  constructor() {}
}
