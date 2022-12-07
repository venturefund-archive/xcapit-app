export interface TotalInvestedBalanceOf {
  value(): Promise<number>;
  cached(): Promise<number>;
}
