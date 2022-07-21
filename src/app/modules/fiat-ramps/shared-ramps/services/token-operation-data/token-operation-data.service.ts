import { Injectable } from '@angular/core';
import { TokenOperationData } from '../../interfaces/token-operation-data.interface';

@Injectable({
  providedIn: 'root'
})
export class TokenOperationDataService {

  tokenOperationData: TokenOperationData;
  constructor() { }

  clean(){
    this.tokenOperationData = undefined;
  }
}
