import { Injectable } from '@angular/core';
import { AppStorageService, StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletRepo } from '../../wallet-repo/wallet-repo';
import { Wallets } from '../wallets';


@Injectable({ providedIn: 'root' })
export class WalletsFactory {

  constructor(private appStorageService: AppStorageService) {}

  create(aStorage: StorageService = this.appStorageService): Wallets {
    return new Wallets(new WalletRepo(aStorage));
  }
}
