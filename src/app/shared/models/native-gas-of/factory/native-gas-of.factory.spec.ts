import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { NativeGasOfFactory } from './native-gas-of.factory';
import { NativeGasOf } from '../native-gas-of';

describe('NativeGasOfFactory', () => {
  let nativeGasOfFactory: NativeGasOfFactory;
  let coinSpy: jasmine.SpyObj<Coin>;
  let transactionRequest: jasmine.SpyObj<TransactionRequest>;

  beforeEach(() => {
    nativeGasOfFactory = new NativeGasOfFactory();
  });

  it('create factory', () => {
    expect(nativeGasOfFactory).toBeTruthy();
  });

  it('create', () => {
    expect(nativeGasOfFactory.create(coinSpy, transactionRequest)).toBeInstanceOf(NativeGasOf);
  });
});
