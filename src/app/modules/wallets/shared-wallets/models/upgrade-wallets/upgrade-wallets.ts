import { Injectable } from '@angular/core';
import { AppStorageService } from '../../../../../shared/services/app-storage/app-storage.service';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { AddressesToSave } from '../addresses-to-save/addresses-to-save';
import { Subscribable } from 'src/app/shared/models/simple-subject/simple-subject';
import { WalletRepo } from '../wallet-repo/wallet-repo';
import { WalletsFactory } from '../wallets/factory/wallets.factory';
import { DefaultWallets } from '../wallets/default-wallets';

@Injectable({ providedIn: 'root' })
export class UpgradeWallets {
  private _cachedWallets: DefaultWallets;

  constructor(
    private _walletsFactory: WalletsFactory,
    private _appStorageService: AppStorageService,
    private _apiWalletService: ApiWalletService
  ) {}

  public async run(): Promise<void> {
    this._wallets()
      .onUpgraded()
      .subscribe(async () =>
        this._apiWalletService.saveWalletAddresses(
          new AddressesToSave(await new WalletRepo(this._appStorageService).storedData()).toJson()
        )
      );
    await this._wallets().upgrade();
  }

  public onNeedPass(): Subscribable {
    return this._wallets().onNeedPass();
  }

  private _wallets(): DefaultWallets {
    if (!this._cachedWallets) {
      this._cachedWallets = this._walletsFactory.create();
    }
    return this._cachedWallets;
  }
}
