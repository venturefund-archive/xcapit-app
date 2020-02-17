import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface AKDataInterface {
  exchange: string;
  api_key: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageApikeysService {
  constructor() {}

  initial = {
    api_key: '',
    exchange: ''
  };

  private dataSource = new BehaviorSubject<AKDataInterface>(this.initial);
  data = this.dataSource.asObservable();
  valid = false;

  public updateData(data: AKDataInterface) {
    this.dataSource.next(data);
    this.valid = true;
  }

  public clear() {
    this.dataSource.next(this.initial);
    this.valid = false;
  }
}
