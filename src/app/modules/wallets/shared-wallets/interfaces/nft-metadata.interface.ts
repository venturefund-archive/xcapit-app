import { NFTAttribute } from './nft-attribute.interface';

export interface NFTMetadata {
  description: string;
  name: string;
  image: string;
  attributes: NFTAttribute[];
}
