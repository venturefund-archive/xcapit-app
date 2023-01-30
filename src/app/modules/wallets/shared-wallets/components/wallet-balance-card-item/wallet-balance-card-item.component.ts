import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { NETWORK_COLORS } from '../../constants/network-colors.constant';
import { TokenDetail } from '../../models/token-detail/token-detail';
import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';

@Component({
  selector: 'app-wallet-balance-card-item',
  template: `
    <div class="wbci ion-padding" (click)="this.goToAssetDetail()">
      <div><img class="wbci__img" [src]="this.tplToken.logoRoute" alt="Asset icon" /></div>
      <div class="wbci__content">
        <div class="wbci__content__top">
          <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-bold wbci__content__top__name-label"
            >{{ this.tplToken.value }}
            <ion-badge [color]="this.networkColors[this.tplToken.network]" class="ux-badge ux-font-num-subtitulo">{{
              this.tplToken.network | formattedNetwork | uppercase
            }}</ion-badge>
          </ion-label>
          <div class="wbci__content__top__balance">
            <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-semibold">{{
              this.tokenDetail.balance | formattedAmount | hideText : this.hideFundText
            }}</ion-label>
          </div>
        </div>
        <div class="wbci__content__bottom">
          <ion-label class="ux-font-text-xs"
            >{{ this.formattedTokenName | titlecase }}
          </ion-label>
          <ion-label class="ux-font-text-xs">
            = {{
              this.tokenDetail.price * this.tokenDetail.balance
                | formattedAmount : 10 : 2
                | hideText : this.hideFundText
            }}
            {{ this.tokenDetail.quoteSymbol }}
          </ion-label>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./wallet-balance-card-item.component.scss'],
})
export class WalletBalanceCardItemComponent implements OnInit {
  hideFundText: boolean;
  @Input() tokenDetail: TokenDetail;
  @Input() last: boolean;
  networkColors = NETWORK_COLORS;
  tplToken: RawToken;
  formattedTokenName: string;

  constructor(private navController: NavController, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.subscribeOnHideFunds();
    this.tplToken = this.tokenDetail.token;
    this.formatTokenName();
  }

  formatTokenName() {
    this.formattedTokenName = this.tplToken.name.substring(
      this.tplToken.name.indexOf('- ') + 1,
      this.tplToken.name.length
    );
    this.formattedTokenName = this.formattedTokenName === ' Polygon' ? 'Matic' : this.formattedTokenName;
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  goToAssetDetail() {
    this.navController.navigateForward([
      'wallets/token-detail/blockchain',
      this.tokenDetail.token.network,
      'token',
      this.tokenDetail.token.contract,
    ]);
  }
}
