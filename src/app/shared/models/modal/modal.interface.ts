export interface Modal {
  show: (config?: any) => Promise<void>;
  onDidDismiss: () => Promise<any>;
}
