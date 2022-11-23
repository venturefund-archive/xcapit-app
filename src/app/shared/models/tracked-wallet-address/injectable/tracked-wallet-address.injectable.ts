import { Injectable } from '@angular/core';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { TrackedWalletAddress } from '../tracked-wallet-address';

@Injectable({ providedIn: 'root' })
export class TrackedWalletAddressInjectable {
  constructor(
    private _trackService: TrackService,
    private _walletEncryptionService: WalletEncryptionService,
    private _storage: IonicStorageService
  ) {}

  public create(): TrackedWalletAddress {
    return new TrackedWalletAddress(this._trackService, this._walletEncryptionService, this._storage);
  }
}
