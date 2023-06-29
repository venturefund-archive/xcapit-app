export interface Modal {
  show: (config?: any) => Promise<void>;
  showIn: (url: string, config?: any) => Promise<void>;
  onDidDismiss: () => Promise<any>;
}
