import { Injectable } from '@angular/core';
import { TypedData } from 'eth-sig-util';
import { CovalentTransfer } from '../../models/covalent-transfer/covalent-transfer';

@Injectable({
    providedIn: 'root',
  })
  export class TransactionDetailsService {
    transactionData: CovalentTransfer;
  
    constructor() {}
  }