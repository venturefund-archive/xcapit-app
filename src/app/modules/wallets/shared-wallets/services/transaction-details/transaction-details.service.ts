import { Injectable } from '@angular/core';
import { Transfer } from '../../models/transfer/transfer.interface';

@Injectable({
    providedIn: 'root',
  })
  export class TransactionDetailsService {
    transactionData: Transfer;

    constructor() {}
  }
