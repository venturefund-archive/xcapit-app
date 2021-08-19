export interface Coin {
  id: number;
  name: string;
  logoRoute: string;
  last: boolean;
  value: string;
  network: string;
  rpc: string;
  contract?: string;
  abi?: string;
  selected?: boolean;
}
