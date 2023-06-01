import { WalletCreationMethod } from "src/app/shared/types/wallet-creation-method.type";

export interface DataRepo {
  creationMethod(): Promise<WalletCreationMethod>
  addressByName(aBlockchainName: string): Promise<string>;
  encryptedRootWallet(): Promise<string>;
  save(addresses: any, encryptedWallet: string): Promise<void>;
  update(addresses: any, encryptedWallet: string): Promise<void>;
}
