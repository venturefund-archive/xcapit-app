import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { IonicStorageService } from '../../services/ionic-storage/ionic-storage.service';
import { TrackService } from '../../services/track/track.service';

export class TrackedWalletAddress {
  private walletTrackedLabel = 'walletAddressTracked';

  constructor(
    private readonly trackService: TrackService,
    private readonly walletEncryptionService: WalletEncryptionService,
    private readonly storage: IonicStorageService
  ) {}

  public async value(): Promise<void> {
    if (!(await this.isWalletAddressTracked())) {
      this.wallet().then((wallet) => {
        if (wallet) this.logWalletAddress(wallet.addresses['ERC20']);
      });
    }
  }

  private wallet() {
    return this.walletEncryptionService.getEncryptedWallet();
  }

  private logWalletAddress(walletAddress: string) {
    this.trackService.trackEvent({
      eventAction: 'log',
      eventLabel: 'ux_log_wallet_address',
      wallet_address: walletAddress,
    });
    this.storage.set(this.walletTrackedLabel, true);
  }

  private isWalletAddressTracked() {
    return this.storage.get(this.walletTrackedLabel);
  }
}
