import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Option, Web3Option } from 'src/app/shared/models/web3-option/web3-option';
import { ActiveLenderInjectable } from 'src/app/shared/models/active-lender/injectable/active-lender.injectable';
import { LastVersionInjectable } from 'src/app/shared/models/last-version/injectable/last-version.injectable';

@Component({
  selector: 'app-select-wallet-type',
  template: `
    <div class="bg">
      <div class="bg__close_button">
        <ion-button
          name="Close button"
          class="bg__close ion-no-padding"
          slot="icon-only"
          fill="clear"
          color="white"
          (click)="this.close()"
        >
          <ion-icon class="bg__close_button__icon" name="ux-close"></ion-icon>
        </ion-button>
      </div>
    </div>
    <ion-content class="swt ion-padding">
      <div class="swt__content">
        <div class="swt__content__header">
          <div class="swt__content__header__title">
            <ion-text class="ux-font-text-xl">
              {{ 'wallets.select_wallet_type.title' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="swt__content__button">
          <ng-container *ngFor="let option of this.options">
            <ng-container *ngIf="option">
              <app-wallet-type-card [option]="option"></app-wallet-type-card>
            </ng-container>
          </ng-container>
        </div>
      </div>
    </ion-content>
    <ion-footer class="swt__footer">
      <ion-toolbar class="ux_toolbar">
        <div class="swt__footer__support">
          <app-whatsapp-support></app-whatsapp-support>
        </div>
      </ion-toolbar>
    </ion-footer>
  `,
  styleUrls: ['./select-wallet-type.page.scss'],
})
export class SelectWalletTypePage {
  options: Option[] = [];
  constructor(
    private navController: NavController,
    private translate: TranslateService,
    private activeLenderInjectable: ActiveLenderInjectable,
    private lastVersionInjectable: LastVersionInjectable
  ) {}

  async ionViewWillEnter() {
    await this._setLender();
  }

  close(): void {
    this.navController.navigateBack('/users/on-boarding');
  }

  private async _setLender() {
    this.options = (await this.lastVersionInjectable.create().inReview())
      ? [this._web3OptionTpl()]
      : [(await this.activeLenderInjectable.create().value()).json(), this._web3OptionTpl()];
  }

  private _web3OptionTpl(): Option {
    return new Web3Option(this.translate).json();
  }
}
