export interface BalanceModal {
  show: () => Promise<void>;
  onDidDismiss: () => Promise<any>;
}