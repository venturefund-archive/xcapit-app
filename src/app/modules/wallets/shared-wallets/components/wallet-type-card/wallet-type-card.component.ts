import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WalletInitializeProcess } from '../../services/wallet-initialize-process/wallet-initialize-process';
import { Option } from '../../../../../shared/models/web3-option/web3-option';

@Component({
  selector: 'app-wallet-type-card',
  template: ` <div
    name="Select Lender"
    class="wtc ux-card no-border"
    appTrackClick
    [dataToTrack]="{ eventLabel: this.option.trackClickEvent }"
    (click)="this.click()"
  >
    <div class="wtc__icon">
      <img [src]="this.option.icon" />
    </div>
    <div class="wtc__content">
      <div class="wtc__content__title">
        <ion-text class="ux-font-text-lg">
          {{ this.option.title }}
        </ion-text>
      </div>
      <div class="wtc__content__description">
        <ion-text class="ux-font-text-xxs">
          {{ this.option.description }}
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
  @Input() option: Option;
  constructor(private navController: NavController, private walletInitializeProcess: WalletInitializeProcess) {}

  ngOnInit() {}

  click() {
    this.walletInitializeProcess.setWarrantyWallet(this.option.isWarrantyLender);
    this.navController.navigateForward(this.option.firstStepUrl);
  }
}
