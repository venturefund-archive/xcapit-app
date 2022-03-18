import { DefaultNFT } from './nft.class';
import { UrlImageOf } from './url-image-of.class';

describe('Url Image Of', () => {
  const urlGateway = 'https://asdf.asdx';

  it('should create', () => {
    expect(new UrlImageOf(new DefaultNFT({ image: '' }))).toBeTruthy();
    expect(new UrlImageOf(new DefaultNFT({ image: '' }), 'https://asdf.asdf')).toBeTruthy();
  });

  it('should return url when nft image is ipfs protocol', () => {
    const hash = 'asdf';
    const nftMetadata = { image: `ipfs://${hash}` };
    const urlImage = new UrlImageOf(new DefaultNFT(nftMetadata), urlGateway);

    expect(urlImage.value()).toEqual(`${urlGateway}/${hash}`);
  });

  it('should return url when nft image is url', () => {
    const nftMetada = { image: 'https://test.test/asdf' };
    const urlImage = new UrlImageOf(new DefaultNFT(nftMetada), urlGateway);

    expect(urlImage.value()).toEqual(nftMetada.image);
  });
});
