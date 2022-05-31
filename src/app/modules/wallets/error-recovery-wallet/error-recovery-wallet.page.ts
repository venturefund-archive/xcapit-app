import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-error-recovery-wallet',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content [data]="this.data" imageAlt="Error Image"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./error-recovery-wallet.page.scss'],
})
export class ErrorRecoveryWalletPage implements OnInit {
  ionViewWillEnter() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_import_screenview_error'
    });
  }
  data: any;
  constructor(private trackService: TrackService
    ) {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.error_wallet_recovery;
  }
}
