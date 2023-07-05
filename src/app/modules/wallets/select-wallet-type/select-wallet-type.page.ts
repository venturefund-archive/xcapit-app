import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RawLender } from '../../../shared/models/lender/raw-lender.type';
import { NaranjaXLender } from '../../../shared/models/lender/naranjax/naranjax-lender';
import { TranslateService } from '@ngx-translate/core';
import { NullLender } from 'src/app/shared/models/lender/null/null-lender';

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
          <ng-container *ngIf="this.rawLender">
            <ng-container *appFeatureFlag="'ff_warranty_wallet'">
              <app-wallet-type-card [rawLender]="this.rawLender"></app-wallet-type-card>
            </ng-container>
          </ng-container>
          <ng-container *ngIf="this.rawNullLender">
            <app-wallet-type-card [rawLender]="this.rawNullLender"></app-wallet-type-card>
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
  rawLender: RawLender;
  rawNullLender: RawLender;
  constructor(private navController: NavController, private translate: TranslateService) {}

  ionViewWillEnter() {
    this.rawLender = new NaranjaXLender(this.translate).json();
    this.rawNullLender = new NullLender(this.translate).json();
  }

  close(): void {
    this.navController.navigateBack('/users/on-boarding');
  }
}
