import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

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
  data: any;
  profileTestComplete: boolean;
  key = 'profileTestCompleted';

  constructor(private ionicStorageService: IonicStorageService) {}

  ngOnInit() {
    this.getProfileStatus();
    this.data = { ...SUCCESS_TYPES.success_wallet_recovery };
  }

  changeUrlIfProfileCompleted() {
    if (this.profileTestComplete) this.data.urlPrimaryAction = '/tabs/wallets';
  }

  getProfileStatus() {
    this.ionicStorageService.get(this.key).then((value: boolean) => {
      this.profileTestComplete = value;
      this.changeUrlIfProfileCompleted();
    });
  }
}
