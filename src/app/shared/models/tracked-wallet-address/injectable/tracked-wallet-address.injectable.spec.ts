import { WalletEncryptionService } from "src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service";
import { IonicStorageService } from "src/app/shared/services/ionic-storage/ionic-storage.service";
import { TrackService } from "src/app/shared/services/track/track.service";
import { TrackedWalletAddress } from "../tracked-wallet-address";
import { TrackedWalletAddressInjectable } from "./tracked-wallet-address.injectable";

describe('TrackedWalletAddressInjectable', () => {
    let trackedWalletAddressInjectable: TrackedWalletAddressInjectable;
    let trackServiceSpy: jasmine.SpyObj<TrackService>;
    let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
    let storageSpy: jasmine.SpyObj<IonicStorageService>;
  
    beforeEach(() => {
      trackedWalletAddressInjectable = new TrackedWalletAddressInjectable(
        trackServiceSpy,
        walletEncryptionServiceSpy,
        storageSpy
      );
    });
    it('new', () => {
      expect(trackedWalletAddressInjectable).toBeTruthy();
    });
  
    it('create', () => {
      expect(trackedWalletAddressInjectable.create()).toBeInstanceOf(TrackedWalletAddress);
    });
  });