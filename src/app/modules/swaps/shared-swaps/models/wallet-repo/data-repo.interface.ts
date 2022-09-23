export interface DataRepo {
  addressByName(aBlockchainName: string): Promise<string>;
  encryptedRootWallet(): Promise<string>;
  save(addresses: any, encryptedWallet: string): Promise<void>;
}
