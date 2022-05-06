import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OperationDataInterface {
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
  network: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageOperationService {
  constructor() {}
  // TODO: Dejar el initial por defecto con todo vacio
  // initial = {
  //   country: '',
  //   type: '',
  //   pair: '',
  //   amount_in: '',
  //   amount_out: '',
  //   currency_in: '',
  //   currency_out: '',
  //   price_in: '',
  //   price_out: '',
  //   wallet: '',
  //   provider: '',
  //   network: '',
  // };
  initial = {
    amount_in: '500',
    amount_out: '2.433208428633997',
    country: 'Argentina',
    currency_in: 'ARS',
    currency_out: 'USDC',
    network: 'MATIC',
    pair: 'ARS_USDC',
    price_in: '205.49',
    price_out: '1',
    provider: '1',
    type: 'cash-in',
    wallet: '0x4eCbFb306585A7f981cF0Fe298162EDce4D11699',
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
