import nftAbi from './nft-abi/nft_abi.json';
import { environment } from 'src/environments/environment';

export const NFT_DATA_NONPROD = [
  {
    contractAddress: '0x9592a6cb3a9d53ff9967610e12b503e53929ffaf',
    rpc: environment.maticApiUrl,
    abi: nftAbi,
  },
  {
    contractAddress: '0x662a663177881F230C96E1E9d22783Dd800A778d',
    rpc: environment.maticApiUrl,
    abi: nftAbi,
  }
];
