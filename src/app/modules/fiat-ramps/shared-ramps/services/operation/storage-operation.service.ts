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
  }

  public getData() {
    return { ...this.data };
  }
}
