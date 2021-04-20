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

  public updateData(data: AKDataInterface) {
    this.data = data;
  }

  public clear() {
    this.data = undefined;
  }
}
