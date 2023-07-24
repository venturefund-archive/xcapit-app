import { Injectable } from '@angular/core';
import { SummaryWarrantyData } from '../../../send-warranty/interfaces/summary-warranty-data.interface';

@Injectable({
  providedIn: 'root',
})
export class WarrantyDataService {
  data: SummaryWarrantyData;

  constructor() {}
}

export class FakeWarrantyDataService {
  data: SummaryWarrantyData;
}
