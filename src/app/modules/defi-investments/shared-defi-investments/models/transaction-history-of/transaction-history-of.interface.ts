export interface TransactionHistoryOf {
    value: () => Promise<>;
    cached: () => Promise<>;
  }