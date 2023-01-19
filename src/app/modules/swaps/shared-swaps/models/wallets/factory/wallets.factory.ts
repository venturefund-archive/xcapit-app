import { Injectable } from '@angular/core';
import { AppStorageService, StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { BlockchainsFactory } from '../../blockchains/factory/blockchains.factory';
import { WalletRepo } from '../../wallet-repo/wallet-repo';
import { Wallets } from '../wallets';


@Injectable({ providedIn: 'root' })
export class WalletsFactory {

  constructor(private appStorageService: AppStorageService, private blockchainsFactory: BlockchainsFactory) {}

  create(aStorage: StorageService = this.appStorageService, blockchains: any = this.blockchainsFactory.create()): Wallets {
    // TODO: ver q onda esto.. mepa q blockchains vuela
    return new Wallets(new WalletRepo(aStorage), blockchains);
  }
}
