import BWC from 'bitcore-wallet-client';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';

export interface Wallet {
  walletClient: BWC;
  rootKey: Key;
  secret: string;
  preferences?: any;
}
