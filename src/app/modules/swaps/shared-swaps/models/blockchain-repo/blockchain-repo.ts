export type RawBlockchain = {
  name: string;
  derivedPath: string;
  id: string;
  rpc: string;
  gasPrice?: string;
  nativeToken: any;
};


export class BlockchainRepo {

  constructor(private rawData: RawBlockchain[]) { }

  all(): RawBlockchain[] {
    return this.rawData;
  }

  byName(aBlockchainName: string): RawBlockchain {
    return this.rawData.find(item => item.name === aBlockchainName);
  }
}
