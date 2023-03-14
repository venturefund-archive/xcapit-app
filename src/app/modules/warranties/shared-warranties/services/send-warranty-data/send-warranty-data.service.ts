import { Injectable } from '@angular/core';
import { SummaryWarrantyData } from '../../../send-warranty/interfaces/summary-warranty-data.interface';

@Injectable({
  providedIn: 'root',
})
export class SendWarrantyDataService {
  data: SummaryWarrantyData;

  constructor() {}
}
