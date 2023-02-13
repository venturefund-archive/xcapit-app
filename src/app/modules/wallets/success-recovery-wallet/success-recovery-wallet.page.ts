import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { TrackedWalletAddressInjectable } from '../../../shared/models/tracked-wallet-address/injectable/tracked-wallet-address.injectable';

@Component({
  selector: 'app-success-recovery-wallet',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content [data]="this.data" imageAlt="Success Image"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-recovery-wallet.page.scss'],
})
export class SuccessRecoveryWalletPage implements OnInit {
  data = structuredClone(SUCCESS_TYPES.success_wallet_recovery);
  key = 'profileTestCompleted';

  constructor(
    private storage: IonicStorageService,
    private trackService: TrackService,
    private trackedWalletAddress: TrackedWalletAddressInjectable
  ) {}

  ngOnInit() {
    this.getProfileStatus();
    this.trackScreenViewEvent();
    this.trackWalletAddressEvent();
  }

  trackScreenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_import_screenview_success',
    });
  }

  trackWalletAddressEvent() {
    this.trackedWalletAddress.create().value();
  }

  changeDataIf(profileTestComplete : boolean) {
    if (profileTestComplete) {
      this.data.urlPrimaryAction = '/tabs/wallets';
      this.data.namePrimaryAction = 'wallets.success_wallet_recovery.button_home'
    }
  }

  getProfileStatus() {
    this.storage.get(this.key).then((value: boolean) => {
      this.changeDataIf(value);
    });
  }
}
