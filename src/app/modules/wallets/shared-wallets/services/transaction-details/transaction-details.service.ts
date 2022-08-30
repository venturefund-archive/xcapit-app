import { Injectable } from '@angular/core';
import { TypedData } from 'eth-sig-util';
import { CovalentTransfer } from '../../models/covalent-transfer/covalent-transfer';
import { Transfer } from '../../models/transfer/transfer.interface';

@Injectable({
    providedIn: 'root',
  })
  export class TransactionDetailsService {
    transactionData: Transfer;

    constructor() {}
  }
