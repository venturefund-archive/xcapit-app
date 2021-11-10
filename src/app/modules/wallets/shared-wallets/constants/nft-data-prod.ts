import nftAbi from './nft-abi/nft_abi.json';
import { environment } from 'src/environments/environment';
export const NFT_DATA_PROD = {
  contractAddress: '0x042841842502d3eaf1946f52e77cc5c48f40dff6',
  rpc: environment.maticApiUrl,
  abi: nftAbi,
};
