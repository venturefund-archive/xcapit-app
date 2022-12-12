import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { OperationDataInterface } from '../../interfaces/operation-data.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageOperationService {
  private data: OperationDataInterface;
  private voucher: Photo;

  constructor() {}

  public updateData(data: OperationDataInterface) {
    this.data = data;
  }

  public getData() {
    return { ...this.data };
  }

  public getVoucher() {
    if (!this.voucher) return;
    return { ...this.voucher };
  }

  public updateVoucher(voucher: Photo) {
    this.voucher = voucher;
  }
}
