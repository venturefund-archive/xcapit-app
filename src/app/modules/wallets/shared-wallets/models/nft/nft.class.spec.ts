import { DefaultNFT, NFT } from './nft.class';

describe('NFT', () => {
  let nft: NFT;
  const nftRawData1 = {
    image: 'https://test.test/asdfqwer',
    name: 'testName',
    description: 'asdf sasdfaa fdsa',
    tokenID: 2,
    contractAddress: '0x0',
  };

  beforeEach(() => {
    nft = new DefaultNFT(nftRawData1);
  });

  it('should create', () => {
    expect(nft).toBeTruthy();
  });

  it('should return image', () => {
    expect(nft.image()).toEqual(nftRawData1.image);
  });

  it('should return name', () => {
    expect(nft.name()).toEqual(nftRawData1.name);
  });

  it('should return description', () => {
    expect(nft.description()).toEqual(nftRawData1.description);
  });

  it('should return token id', () => {
    expect(nft.id()).toEqual(nftRawData1.tokenID);
  });

  it('should return contract address', () => {
    expect(nft.contractAddress()).toEqual(nftRawData1.contractAddress);
  });
});
