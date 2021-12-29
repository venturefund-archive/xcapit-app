import { ContractInterface } from 'ethers';

export interface Coin {
  id: number;
  name: string;
  logoRoute: string;
  last: boolean;
  value: string;
  network: string;
  chainId: number;
  rpc: string;
  contract?: string;
  abi?: ContractInterface;
  decimals?: number;
  selected?: boolean;
  native?: boolean;
  moonpayCode?: string;
}
