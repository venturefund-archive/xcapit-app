import { Injectable } from '@angular/core';

interface AKDataInterface {
  alias: string;
  apiKey: string;
  apiSecret: string;
  exchange: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageApikeysService {
  constructor() {}
  data: AKDataInterface;
  private default: AKDataInterface = {
    alias: '',
    apiKey: '',
    apiSecret: '',
    exchange: 'binance'
  };

  public updateData(data: AKDataInterface) {
    this.data = data;
  }

  public clear() {
    this.data = this.default;
  }
}
