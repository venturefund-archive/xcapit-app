export interface NFT {
  id(): string | number;
  image(): string;
  name(): string;
  description(): string;
  contractAddress(): string;
}

export class NullNFT implements NFT {
  id(): string | number {
    return '';
  }
  image(): string {
    return '';
  }
  name(): string {
    return '';
  }
  description(): string {
    return '';
  }
  contractAddress(): string {
    return '';
  }
}

export class DefaultNFT implements NFT {
  constructor(private _nftRawData: any) {}

  id(): string | number {
    return this._nftRawData.tokenID;
  }

  image(): string {
    return this._nftRawData.image;
  }

  name(): string {
    return this._nftRawData.name;
  }

  description(): string {
    return this._nftRawData.description;
  }

  contractAddress(): string {
    return this._nftRawData.contractAddress;
  }
}
