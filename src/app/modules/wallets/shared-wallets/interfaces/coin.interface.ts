export interface Coin {
  id: number;
  name: string;
  logoRoute: string;
  last: boolean;
  value: string;
  network: string;
  rpc: string;
  contract?: string;
  abi?: JSON;
  decimals?: number;
  selected?: boolean;
  native?: boolean;
}
