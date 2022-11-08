import { Injectable } from '@angular/core';
import { OperationDataInterface } from '../../interfaces/operation-data.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageOperationService {
  private data: OperationDataInterface;

  constructor() {}

  public updateData(data: OperationDataInterface) {
    this.data = data;
    console.log(this.data)
  }

  public getData() {
    console.log(this.data)
    return { ...this.data };
  }
}
