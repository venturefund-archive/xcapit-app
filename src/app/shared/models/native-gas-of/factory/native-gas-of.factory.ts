import { Injectable } from '@angular/core';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { NativeGasOf } from '../native-gas-of';

@Injectable({ providedIn: 'root' })
export class NativeGasOfFactory {
  create(_aToken: Coin, _aTransactionRequest: TransactionRequest): NativeGasOf {
    return NativeGasOf.create(_aToken, _aTransactionRequest);
  }
}
