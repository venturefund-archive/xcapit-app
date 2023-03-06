import { Injectable } from '@angular/core';
import { WalletsFactory } from '../../../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { AppStorageService } from '../../../../../shared/services/app-storage/app-storage.service';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { WalletRepo } from '../../../../swaps/shared-swaps/models/wallet-repo/wallet-repo';
import { AddressesToSave } from '../addresses-to-save/addresses-to-save';
import { Subscribable } from 'src/app/shared/models/simple-subject/simple-subject';
import { Wallets } from 'src/app/modules/swaps/shared-swaps/models/wallets/wallets';

@Injectable({ providedIn: 'root' })
export class UpgradeWallets {
  private _cachedWallets: Wallets;

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

  private _wallets(): Wallets {
    if (!this._cachedWallets) {
      this._cachedWallets = this._walletsFactory.create();
    }
    return this._cachedWallets;
  }
}
