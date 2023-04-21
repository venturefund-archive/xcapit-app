import { BlockchainTx } from '../blockchain-tx';
import { IBlockchain } from '../blockchain/blockchain';
import { Subscribable } from '../../../../../shared/models/simple-subject/simple-subject';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';

export interface Wallet {
  address: () => string;
  onNeedPass: () => Subscribable;
  sendTxs: (transactions: BlockchainTx[]) => Promise<boolean>;
  blockchain: () => IBlockchain;
  signMessage?: (message: string) => Promise<string>;
  sendTransaction?: (tx: BlockchainTx) => Promise<any>;
  signTypedData?: (
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ) => any;
  signTransaction?: (tx: BlockchainTx) => Promise<any>;
}
