import { Injectable } from '@angular/core';

interface AKDataInterface {
  id: string;
  alias: string;
  nombre_bot: string;
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
