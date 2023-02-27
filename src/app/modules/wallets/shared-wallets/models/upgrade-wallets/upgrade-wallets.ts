import { Injectable } from '@angular/core';
import { WalletsFactory } from '../../../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { AppStorageService } from '../../../../../shared/services/app-storage/app-storage.service';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { Password } from '../../../../swaps/shared-swaps/models/password/password';
import { WalletRepo } from '../../../../swaps/shared-swaps/models/wallet-repo/wallet-repo';
import { AddressesToSave } from '../addresses-to-save/addresses-to-save';

@Injectable({ providedIn: 'root' })
export class UpgradeWallets {
  constructor(
    private _walletsFactory: WalletsFactory,
    private _appStorageService: AppStorageService,
    private _apiWalletService: ApiWalletService
  ) {}

  public async run(aPassword: Password): Promise<void> {
    const wallets = this._walletsFactory.create();
    wallets
      .onUpgraded()
      .subscribe(async () =>
        this._apiWalletService.saveWalletAddresses(
          new AddressesToSave(await new WalletRepo(this._appStorageService).storedData()).toJson()
        )
      );
    await wallets.upgrade(aPassword);
  }
}
