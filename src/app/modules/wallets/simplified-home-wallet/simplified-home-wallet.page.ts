import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { RawBlockchain } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { Transfer } from '../shared-wallets/models/transfer/transfer.interface';
import { Blockchain } from '../../swaps/shared-swaps/models/blockchain/blockchain';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { TransfersFactory } from '../shared-wallets/models/transfers/factory/transfers.factory';
import { TokenByAddress } from '../../swaps/shared-swaps/models/token-by-address/token-by-address';
import { DefaultTokens } from '../../swaps/shared-swaps/models/tokens/tokens';
import { RawToken, TokenRepo } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { BlockchainTokens } from '../../swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Token } from '../../swaps/shared-swaps/models/token/token';
import { Wallet } from '../../swaps/shared-swaps/models/wallet/wallet';
import { WalletsFactory } from '../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';
import { FixedTokens } from '../../swaps/shared-swaps/models/filtered-tokens/fixed-tokens';
import { CovalentBalancesInjectable } from '../shared-wallets/models/balances/covalent-balances/covalent-balances.injectable';
import { TokenPricesInjectable } from '../shared-wallets/models/prices/token-prices/token-prices.injectable';
import { TokenDetailInjectable } from '../shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { WarrantiesService } from '../../warranties/shared-warranties/services/warranties.service';
import { GeneralModalWithTwoButtonsComponent } from 'src/app/shared/components/general-modal-with-two-buttons/general-modal-with-two-buttons.component';
import { ModalController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-simplified-home-wallet',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <div class="header">
          <app-xcapit-logo [whiteLogo]="true"></app-xcapit-logo>
        </div>
        <app-avatar-profile></app-avatar-profile>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="swt__subheader">
        <div class="swt__subheader__title ux-font-num-subtitulo">
          <ion-text> {{ 'wallets.simplified_home_wallet.available_balance' | translate }} </ion-text>
        </div>
        <div class="swt__balance ux-font-num-titulo">
          <ion-spinner color="white" name="crescent" *ngIf="!this.tokenDetail"></ion-spinner>
          <div class="swt__balance__amount">
            <div class="swt__balance__amount__value">
              <ion-text *ngIf="this.tokenDetail">
                {{ this.tokenDetail.balance ?? 0.0 | number : '1.2-2' | hideText : this.hideFundText }}
              </ion-text>
              <ion-text class="ux-font-text-lg" *ngIf="this.tokenDetail">USDC</ion-text>
            </div>
            <div *ngIf="this.tokenDetail" class="swt__balance__amount__value__eye">
              <app-eye></app-eye>
            </div>
          </div>
        </div>
        <div class="swt__fiat-balance" *ngIf="this.tokenDetail" color="success">
          <ion-text class="swt__fiat-balance__text ux-font-title-xs">
            =
            {{ this.tokenDetail.price * this.tokenDetail.balance | number : '1.2-2' | hideText : this.hideFundText }}
            USD</ion-text
          >
        </div>
      </div>
      <div class="swt__overlap_buttons">
        <app-simplified-wallet-subheader-buttons
          (openWarrantyModal)="this.openWarrantyModal()"
        ></app-simplified-wallet-subheader-buttons>
      </div>

      <div class="swt__warranty" *ngIf="this.tplToken">
        <div class="swt__warranty__title">
          <ion-label class="ux-font-header-titulo">
            {{ 'wallets.simplified_home_wallet.warranties' | translate }}
          </ion-label>
        </div>
        <div class="swt__warranty__card">
          <ion-label class="swt__warranty__card__title ux-font-titulo-xs">{{
            'wallets.simplified_home_wallet.warranty_amount' | translate
          }}</ion-label>
          <div class="swt__warranty__card__content">
            <div><img class="wbci__img" [src]="this.tplToken.logoRoute" alt="Asset icon" /></div>
            <div class="swt__warranty__card__content__data">
              <div class="swt__warranty__card__content__data__item">
                <ion-label class="ux-font-text-xl">{{ this.tplToken.value }} </ion-label>
                <ion-label
                  *ngIf="this.warranty"
                  class="ux-font-text-xl swt__warranty__card__content__data__item__amount"
                  >{{ this.warranty.amount | formattedAmount }}</ion-label
                >
                <ion-skeleton-text class="base-amount" *ngIf="!this.warranty"></ion-skeleton-text>
              </div>
              <div class="swt__warranty__card__content__data__item">
                <ion-label class="ux-font-text-xs">{{ this.formattedTokenName | titlecase }} </ion-label>
                <ion-label
                  *ngIf="this.warranty"
                  class="ux-font-text-xs swt__warranty__card__content__data__item__amount"
                >
                  {{ this.warranty.amount * this.tokenDetail.price }} USD</ion-label
                >
                <ion-skeleton-text class="fiat-amount" *ngIf="!this.warranty"></ion-skeleton-text>
              </div>
            </div>
          </div>
          <div class="swt__warranty__card__button">
            <ion-button
              class="ux_button"
              color="secondary"
              (click)="this.openWarrantyModal()"
              appTrackClick
              name="ux_nav_go_to_warrant"
              [disabled]="this.disabled"
            >
              {{ 'wallets.home.subheader_buttons_component.warranty_card' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
      <div class="swt__transaction">
        <div class="swt__transaction__title">
          <ion-label class="ux-font-header-titulo">
            {{ 'wallets.asset_detail.wallet_transaction_title' | translate }}
          </ion-label>
        </div>
        <div class="swt__transaction__wallet-transaction-card">
          <app-wallet-transaction-card
            *ngIf="this.transfers !== undefined && this.transfers.length > 0"
            [transfers]="this.transfers"
            [network]="this.tplBlockchain.name"
          ></app-wallet-transaction-card>
          <app-wallet-transaction-skeleton-card
            *ngIf="this.transfers === undefined"
          ></app-wallet-transaction-skeleton-card>
          <div
            class="swt__transaction__wallet-transaction-card__empty"
            *ngIf="this.transfers !== undefined && this.transfers.length === 0"
          >
            <img src="/assets/img/simplified-home-wallet/empty.svg" />
            <ion-label
              class="ux-font-text-xxs"
              [innerHTML]="'wallets.simplified_home_wallet.empty_transactions' | translate"
            >
            </ion-label>
          </div>
        </div>
      </div>
      <div class="swt__whatsapp">
        <app-whatsapp-support></app-whatsapp-support>
      </div>
    </ion-content>`,
  styleUrls: ['./simplified-home-wallet.page.scss'],
})
export class SimplifiedHomeWalletPage {
  hideFundText: boolean;
  transfers: Transfer[];
  tplBlockchain: RawBlockchain;
  tplToken: RawToken;
  tokenDetail: TokenDetail;
  formattedTokenName: string;
  warranty: { amount: number };
  openingModal = false;
  disabled = true;
  modalHref: string;
  private blockchain: Blockchain;
  private token: Token;
  private wallet: Wallet;

  constructor(
    private localStorageService: LocalStorageService,
    private blockchainsFactory: BlockchainsFactory,
    private transfersFactory: TransfersFactory,
    private apiWalletService: ApiWalletService,
    private walletsFactory: WalletsFactory,
    private covalentBalancesInjectable: CovalentBalancesInjectable,
    private tokenPricesInjectable: TokenPricesInjectable,
    private tokenDetailInjectable: TokenDetailInjectable,
    private warrantiesService: WarrantiesService,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  async ionViewWillEnter() {
    this.modalHref = window.location.href;
    this.subscribeOnHideFunds();
    this.setBlockchain();
    await this.setToken();
    this.formatTokenName();
    await this.setWallet();
    await this.getWarranty();
    await this.setTokenDetail();
    await this.getTransfers();
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  private setBlockchain() {
    this.blockchain = this.blockchainsFactory.create().oneByName('MATIC');
    this.tplBlockchain = this.blockchain.json();
  }

  private async setToken() {
    const coin = this.apiWalletService.getCoin('USDC', 'MATIC');
    this.token = await new TokenByAddress(
      coin.contract,
      new BlockchainTokens(this.blockchain, new DefaultTokens(new TokenRepo(this.apiWalletService.getCoins())))
    ).value();
    this.tplToken = this.token.json();
  }

  private async setTokenDetail() {
    const fixedTokens = new FixedTokens([this.token]);
    this.tokenDetail = this.tokenDetailInjectable.create(
      this.covalentBalancesInjectable.create(this.wallet.address(), fixedTokens),
      this.tokenPricesInjectable.create(fixedTokens),
      (await fixedTokens.value())[0]
    );
    await this.tokenDetail.cached();
    await this.tokenDetail.fetch();
    this.checkBalance();
  }

  checkBalance() {
    this.disabled = this.tokenDetail.balance === 0;
    if (this.tokenDetail.balance === 0) {
      this.openWarrantyModalWithBuyOrDepositOpts();
    } else {
      this.openWarrantyModal();
    }
  }

  private async setWallet() {
    this.wallet = await this.walletsFactory.create().oneBy(this.blockchain);
  }

  async getTransfers() {
    this.transfers = undefined;
    const transfers = this.transfersFactory.create(this.token.json(), this.wallet.address());
    this.transfers = await transfers.cached();
    this.transfers = await transfers.all();
  }

  formatTokenName() {
    this.formattedTokenName = this.tplToken.name.substring(
      this.tplToken.name.indexOf('- ') + 1,
      this.tplToken.name.length
    );
    this.formattedTokenName = this.formattedTokenName === ' Polygon' ? 'Matic' : this.formattedTokenName;
  }

  async getWarranty() {
    this.warranty = await this.warrantiesService.verifyWarranty({ wallet: this.wallet.address() }).toPromise();
  }

  async openWarrantyModal() {
    const modal = await this.modalController.create({
      component: GeneralModalWithTwoButtonsComponent,
      cssClass: 'modal',
      backdropDismiss: false,
      componentProps: {
        highlightedHeader: this.translate.instant('warranties.modal_info.highlightedHeader'),
        header: this.translate.instant('warranties.modal_info.header'),
        information: this.translate.instant('warranties.modal_info.information'),
        link: LINKS.naranjax,
        firstButton: this.translate.instant('warranties.modal_info.firstButton'),
        eventFirstButton: 'ux_warranty_start',
        urlFirstButton: 'warranties/send-warranty',
        secondButton: this.translate.instant('warranties.modal_info.secondButton'),
        eventSecondButton: 'ux_warranty_withdraw',
        urlSecondButton: 'warranties/withdraw-warranty',
      },
    });

    await modal.present();
  }

  async openWarrantyModalWithBuyOrDepositOpts() {
    const modal = await this.modalController.create({
      component: GeneralModalWithTwoButtonsComponent,
      cssClass: 'modal',
      backdropDismiss: false,
      componentProps: {
        header: this.translate.instant('warranties.modal_info_to_buy_or_deposit.header'),
        information: this.translate.instant('warranties.modal_info.information'),
        link: LINKS.naranjax,
        firstButton: this.translate.instant('warranties.modal_info_to_buy_or_deposit.firstButton'),
        eventFirstButton: 'ux_warranty_buy',
        urlFirstButton: '/fiat-ramps/purchases',
        secondButton: this.translate.instant('warranties.modal_info_to_buy_or_deposit.secondButton'),
        eventSecondButton: 'ux_warranty_receive',
        urlSecondButton: '/wallets/receive/detail?asset=USDC&network=MATIC',
        isBuyOrDeposit: true,
      },
    });

    await modal.present();
  }
}
