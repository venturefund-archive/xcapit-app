import { ContractInterface } from 'ethers';

export interface NFT {
  contractAddress: string;
  rpc: string;
  abi: ContractInterface;
}
