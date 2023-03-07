import { Injectable } from '@angular/core';
import { TokenOperationData } from '../../interfaces/token-operation-data.interface';

@Injectable({
  providedIn: 'root',
})
export class TokenOperationDataService {
  tokenOperationData: TokenOperationData;
  constructor() {}

  clean() {
    this.tokenOperationData = undefined;
  }

  add(data: any) {
    this.tokenOperationData = { ...this.tokenOperationData, ...data };
  }

  set(data: any) {
    this.tokenOperationData = { ...data };
  }

  hasAssetInfo(){
    return !!this.tokenOperationData?.asset
  }
}
