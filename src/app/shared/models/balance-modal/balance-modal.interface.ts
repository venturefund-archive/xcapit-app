export interface BalanceModal {
  show: (config?: any) => Promise<void>;
  onDidDismiss: () => Promise<any>;
}
