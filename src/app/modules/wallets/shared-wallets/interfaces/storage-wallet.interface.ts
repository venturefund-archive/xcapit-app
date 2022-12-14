import { StorageAsset } from './storage-asset.interface';

export interface StorageWallet {
  wallet?: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
  network: string;
  addresses?: any;
  assets: StorageAsset[];
  creationMethod?: 'legacy' | 'default';
}
