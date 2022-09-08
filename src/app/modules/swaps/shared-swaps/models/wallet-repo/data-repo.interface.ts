export interface DataRepo {
    addressByName(aBlockchainName: string): Promise<string>;
    encryptedRootWallet(): Promise<string>;
}