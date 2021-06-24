import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface OperationDataInterface {
  country: string;
  type: string;
  pair: string;
  amount_in: string;
  amount_out: string;
  currency_in: string;
  currency_out: string;
  price_in: string;
  price_out: string;
  wallet: string;
  provider: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageOperationService {
  constructor() {}

  initial = {
    country: '',
    type: '',
    pair: '',
    amount_in: '',
    amount_out: '',
    currency_in: '',
    currency_out: '',
    price_in: '',
    price_out: '',
    wallet: '',
    provider: '',
  };

  private dataSource = new BehaviorSubject<OperationDataInterface>(this.initial);
  data = this.dataSource.asObservable();
  operationId = null;
  valid = false;

  public updateData(data: OperationDataInterface) {
    this.dataSource.next(data);
    this.valid = true;
  }

  public clear() {
    this.dataSource.next(this.initial);
    this.valid = false;
  }

  public setOperationId(id) {
    this.operationId = id;
  }

  public getOperationId() {
    return this.operationId;
  }
}
