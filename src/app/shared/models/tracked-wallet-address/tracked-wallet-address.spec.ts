import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { IonicStorageService } from '../../services/ionic-storage/ionic-storage.service';
import { TrackService } from '../../services/track/track.service';
import { TrackedWalletAddress } from './tracked-wallet-address';

describe('TrackedWalletAddress', () => {
  let trackedWalletService: TrackedWalletAddress;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', {
      get: Promise.resolve(false),
      set: Promise.resolve(null),
    });

    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getEncryptedWallet: Promise.resolve({ addresses: { ERC20: '0xtestAddress' } }),
    });

    trackServiceSpy = jasmine.createSpyObj('TrackService', {
      trackEvent: null,
    });

    trackedWalletService = new TrackedWalletAddress(trackServiceSpy, walletEncryptionServiceSpy, storageSpy);
  });
  it('new', () => {
    expect(trackedWalletService).toBeTruthy();
  });

  it('value', async () => {
    await trackedWalletService.value();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({
      eventAction: 'log',
      eventLabel: 'ux_log_wallet_address',
      wallet_address: '0xtestAddress',
    });
  });
});
