import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RawLender } from 'src/app/shared/models/lender/raw-lender.type';
import { WalletInitializeProcess } from '../../services/wallet-initialize-process/wallet-initialize-process';

@Component({
  selector: 'app-wallet-type-card',
  template: ` <div
    name="Select Lender"
    class="wtc ux-card no-border"
    appTrackClick
    [dataToTrack]="{ eventLabel: this.rawLender.trackClickEvent }"
    (click)="this.click()"
  >
    <div class="wtc__icon">
      <img [src]="this.rawLender.icon" />
    </div>
    <div class="wtc__content">
      <div class="wtc__content__title">
        <ion-text class="ux-font-text-lg">
          {{ this.rawLender.title }}
        </ion-text>
      </div>
      <div class="wtc__content__description">
        <ion-text class="ux-font-text-xxs">
          {{ this.rawLender.description }}
        </ion-text>
      </div>
    </div>
    <div class="wtc__chevron">
      <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
    </div>
  </div>`,
  styleUrls: ['./wallet-type-card.component.scss'],
})
export class WalletTypeCardComponent implements OnInit {
  @Input() rawLender: RawLender;
  constructor(private navController: NavController, private walletInitializeProcess: WalletInitializeProcess) {}

  ngOnInit() {}

  click() {
    this.walletInitializeProcess.setWarrantyWallet(this.rawLender.isWarrantyLender);
    this.navController.navigateForward(this.rawLender.firstStepUrl);
  }
}
