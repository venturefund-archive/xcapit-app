import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { RawMenuCategory } from '../../models/raw-menu-category';

@Component({
  selector: 'app-card-category-menu',
  template: `
    <div class="ux-card" *ngIf="this.category.visible">
      <div class="card-title">
        <img class="card-title__img" [src]="this.category.icon" />
        <ion-text class="ux-font-header-titulo card-title__text" *ngIf="!this.category.route">{{
          this.category.category_title | translate
        }}</ion-text>
        <ion-button
          size="small"
          *ngIf="this.category.route"
          class="ux-font-header-titulo card-title__button"
          fill="clear"
          [id]="this.category.name"
          appTrackClick
          [attr.name]="this.category.buttonName"
          (click)="this.goToRoute(this.category)"
          >{{ this.category.category_title | translate }}</ion-button
        >
        <div class="card-title__legend" *ngIf="this.category.legend">
          <ion-icon [color]="this.category.connected ? 'success' : 'dangerdark'" name="ellipse"></ion-icon>
          <ion-label [color]="this.category.connected ? 'success' : 'dangerdark'" class="ux-font-num-subtitulo">{{
            this.category.legend | translate
          }}</ion-label>
        </div>
        <div class="card-title__badge" *ngIf="this.category.newBadge">
          <ion-badge class="new-badge ux-font-num-subtitulo" slot="end">{{
            'profiles.user_profile_menu.new_badge' | translate
          }}</ion-badge>
        </div>
      </div>
      <div class="item-container" *ngFor="let item of this.category.items">
        <ng-container *appFeatureFlag="item.disable; negated: true">
          <ion-button
            *ngIf="item.visible"
            class="ux-font-text-xs"
            fill="clear"
            [id]="item.name"
            appTrackClick
            [attr.name]="item.buttonName"
            (click)="this.goToRoute(item)"
            >{{ item.text | translate }}</ion-button
          >
          <ion-badge *ngIf="item.visible && item.newBadge" class="new-badge ux-font-num-subtitulo" slot="end">{{
            'profiles.user_profile_menu.new_badge' | translate
          }}</ion-badge>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./card-category-menu.component.scss'],
})
export class CardCategoryMenuComponent {
  @Input() category: RawMenuCategory;

  constructor(
    private navController: NavController,
    private walletService: WalletService,
    private walletConnectService: WalletConnectService,
    private browserService: BrowserService
  ) {}

  async goToRoute(item) {
    let url = item.route;

    if (item.name === 'WalletConnect') {
      if (!(await this.walletService.walletExist())) {
        url = '/wallets/no-wallet';
      } else {
        if (this.walletConnectService.connected) {
          url = '/wallets/wallet-connect/connection-detail';
        }
      }
    }
    if (item.name === 'Community') {
      this.openBrowser(item.route);
      return;
    }
    this.navController.navigateForward(url);
  }

  async openBrowser(link) {
    await this.browserService.open({ url: link });
  }
}
