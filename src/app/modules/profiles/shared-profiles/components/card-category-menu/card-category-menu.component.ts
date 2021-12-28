import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';

@Component({
  selector: 'app-card-category-menu',
  template: `
    <div class="ux-card">
      <div class="card-title">
        <img class="card-title__img" [src]="this.category?.icon" />
        <ion-text class="ux-font-header-titulo card-title__text">{{
          this.category?.category_title | translate
        }}</ion-text>
      </div>
      <div *ngFor="let item of this.category?.items">
        <ion-button
          class="ux-font-text-xs"
          fill="clear"
          [id]="item.name"
          color="uxsemidark"
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
  constructor(private navController: NavController, private walletService: WalletService) {}

  ngOnInit() {}

  async goToRoute(item) {
    let url = item.route;
    if (item.element === 'recoveryPhrase' && !(await this.walletService.walletExist())) {
      url = '/wallets/recovery/info-no-wallet';
    }
    this.navController.navigateForward(url);
  }
}
