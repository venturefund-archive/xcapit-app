import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PROD_COINS } from '../../wallets/shared-wallets/constants/coins.prod';
import { Blockchain } from '../shared-swaps/models/blockchain/blockchain';
import { StandardizedTokens } from '../shared-swaps/models/standardized-tokens/standardized-tokens';
import { DefaultToken } from '../shared-swaps/models/token/token';
import { RawToken, TokenRepo } from '../shared-swaps/models/token-repo/token-repo';
import { Tokens } from '../shared-swaps/models/tokens/tokens';
import { BlockchainsFactory } from '../shared-swaps/models/blockchains/factory/blockchains.factory';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { IntersectedTokensFactory } from '../shared-swaps/models/intersected-tokens/factory/intersected-tokens.factory';
import { BlockchainTokens } from '../shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { OneInchTokens } from '../shared-swaps/models/one-inch-tokens/one-inch-tokens';
import { OneInch } from '../shared-swaps/models/one-inch/one-inch';

@Component({
  selector: 'app-swap-select-token',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/swaps/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'swaps.select_token.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="sc ion-padding">
      <div class="sc__title">
        <ion-label class="ux-font-text-lg">
          {{ this.title | translate }}
        </ion-label>
      </div>
      <div class="sc__list" *ngIf="this.tplTokens">
        <app-token-selection-list
          state="swap"
          [userCoins]="this.tplTokens"
          (clickedCoin)="this.selectToken($event)"
        ></app-token-selection-list>
      </div>
    </ion-content>
  `,
  styleUrls: ['./swap-select-token.page.scss'],
})
export class SwapSelectTokenPage {
  private activeBlockchain: Blockchain;
  private tokens: Tokens;
  private fromTokenKey = 'fromToken';
  private toTokenKey = 'toToken';
  title: string;
  tplTokens: RawToken[] = [];

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private httpClient: HttpClient,
    private blockchains: BlockchainsFactory,
    private trackService: TrackService,
    private intersectedTokens: IntersectedTokensFactory
  ) {}

  selectToken(selectedRawToken: RawToken) {
    this.navController.navigateBack(
      [
        'swaps/home/blockchain',
        this.activeBlockchain.name(),
        'from-token',
        this.tokenAddressOf(this.fromTokenKey, selectedRawToken),
        'to-token',
        this.tokenAddressOf(this.toTokenKey, selectedRawToken),
      ],
      this.navigationExtras()
    );
  }

  private navigationExtras(): NavigationExtras {
    return {
      queryParams: {
        'from-token-amount': this.fromTokenAmount(),
      },
    };
  }

  private fromTokenAmount() {
    return this.route.snapshot.paramMap.get('fromTokenAmount');
  }

  private tokenAddressOf(aTokenKey: string, aSelectedRawToken: RawToken): string {
    return this.tokenToSelect() === aTokenKey
      ? new DefaultToken(aSelectedRawToken).address()
      : this.route.snapshot.paramMap.get(aTokenKey);
  }

  private tokenToSelect(): string {
    return this.route.snapshot.paramMap.get('tokenToSelect');
  }

  async ionViewDidEnter() {
    this.trackPage();
    this.setTitle();
    this.setBlockchain(this.route.snapshot.paramMap.get('blockchain'));
    this.setTokens();
  }

  private trackPage() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: '/swaps/home',
      eventLabel: `ux_swaps_screenview_select_${this.tokenToSelect()}`,
    });
  }

  private setTitle() {
    this.title = `swaps.select_token.${this.tokenToSelect()}_title`;
  }

  private setBlockchain(aBlockchainName: string) {
    this.activeBlockchain = this.blockchains.create().oneByName(aBlockchainName);
  }

  private async setTokens() {
    this.tokens = this.intersectedTokens.create(
      new BlockchainTokens(this.activeBlockchain, new StandardizedTokens(new TokenRepo(PROD_COINS))),
      new OneInchTokens(new OneInch(this.activeBlockchain, this.httpClient))
    );
    this.tplTokens = (await this.tokens.value()).map((token) => token.json());
  }
}
