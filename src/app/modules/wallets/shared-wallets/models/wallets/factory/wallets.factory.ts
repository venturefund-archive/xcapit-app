import { Injectable } from '@angular/core';
import { AppStorageService, StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletRepo } from '../../wallet-repo/wallet-repo';
import { Wallets } from '../wallets';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';


@Injectable({ providedIn: 'root' })
export class WalletsFactory {

  constructor(private appStorageService: AppStorageService, private blockchainsFactory: BlockchainsFactory) {}

  create(aStorage: StorageService = this.appStorageService, blockchains: any = this.blockchainsFactory.create()): Wallets {
    return new Wallets(new WalletRepo(aStorage), blockchains);
  }
}
