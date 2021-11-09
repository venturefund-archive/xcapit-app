import nftAbi from './nft-abi/nft_abi.json';
import { environment } from 'src/environments/environment';
export const NFT_DATA_NONPROD = {
  contractAddress: '0x9592a6cb3a9d53ff9967610e12b503e53929ffaf',
  rpc: environment.maticApiUrl,
  abi: nftAbi,
};
