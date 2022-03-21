import nftAbi from './nft-abi/nft_abi.json';
import { environment } from 'src/environments/environment';
export const NFT_DATA_PROD = [
  {
    contractAddress: '0x042841842502d3eaf1946f52e77cc5c48f40dff6',
    rpc: environment.maticApiUrl,
    abi: nftAbi,
  },
  {
    contractAddress: '0xd724A626EFEA48745AA5D645170D6D91b23e366e',
    rpc: environment.maticApiUrl,
    abi: nftAbi,
  },
  {
    contractAddress: '0xc724197938eA45efBdb1C9c8b6867E0114979e3c',
    rpc: environment.maticApiUrl,
    abi: nftAbi,
  },
];
