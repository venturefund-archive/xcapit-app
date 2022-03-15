import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';

@Component({
  selector: 'app-card-category-menu',
  template: `
    <div class="ux-card" *ngIf="this.category.showCategory">
      <div class="card-title">
        <img class="card-title__img" [src]="this.category.icon" />
        <ion-text class="ux-font-header-titulo card-title__text" *ngIf="!this.category.route">{{
          this.category.category_title | translate
        }}</ion-text>
        <ion-button
          *ngIf="this.category.route"
          class="ux-font-header-titulo card-title__button"
          fill="clear"
          [id]="this.category.name"
          appTrackClick
          (click)="this.goToRoute(this.category)"
          >{{ this.category.category_title | translate }}</ion-button
        >
      </div>
      <div *ngFor="let item of this.category.items">
        <ion-button
          class="ux-font-text-xs"
          fill="clear"
          [id]="item.name"
          color="neutral90"
          appTrackClick
          (click)="this.goToRoute(item)"
          >{{ item.text | translate }}</ion-button
        >
      </div>
    </div>
  `,
  styleUrls: ['./card-category-menu.component.scss'],
})
export class CardCategoryMenuComponent implements OnInit {
  @Input() category;
  @Input() hasFunds;

  constructor(
    private navController: NavController,
    private walletService: WalletService,
    private walletConnectService: WalletConnectService
  ) {}

  ngOnInit() {}

  async goToRoute(item) {
    let url = item.route;
    if (item.name === 'Funds') {
      url = this.hasFunds ? 'tabs/investments/binance' : 'tabs/investments';
    }
    if (item.name === 'WalletConnect') {
      if (!(await this.walletService.walletExist())) {
        url = '/wallets/no-wallet';
      } else {
        if (this.walletConnectService.connected) {
          url = '/wallets/wallet-connect/connection-detail';
        }
      }
    }
    this.navController.navigateForward(url);
  }
}
