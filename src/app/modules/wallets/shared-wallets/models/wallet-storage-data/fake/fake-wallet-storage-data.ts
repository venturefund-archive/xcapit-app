import { WalletStorageData } from "../wallet-storage-data.interface";

export class FakeWalletStorageData implements WalletStorageData {
    save(): Promise<void> {
      return Promise.resolve();
    }
  }