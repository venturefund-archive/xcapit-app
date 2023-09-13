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
import { Wallet } from '../shared-wallets/models/wallet/wallet';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';
import { FixedTokens } from '../../swaps/shared-swaps/models/filtered-tokens/fixed-tokens';
import { CovalentBalancesInjectable } from '../shared-wallets/models/balances/covalent-balances/covalent-balances.injectable';
import { TokenPricesInjectable } from '../shared-wallets/models/prices/token-prices/token-prices.injectable';
import { TokenDetailInjectable } from '../shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { WarrantiesService } from '../../warranties/shared-warranties/services/warranties.service';
import { FiatRampsService } from '../../fiat-ramps/shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../../fiat-ramps/shared-ramps/services/kripton-storage/kripton-storage.service';
import { ActivatedRoute } from '@angular/router';
import { ModalFactoryInjectable } from '../../../shared/models/modal/injectable/modal-factory.injectable';
import { Modals } from '../../../shared/models/modal/factory/default/default-modal-factory';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { Lender } from '../../../shared/models/lender/lender.interface';
import { ActiveLenderInjectable } from '../../../shared/models/active-lender/injectable/active-lender.injectable';
import { WalletsFactory } from '../shared-wallets/models/wallets/factory/wallets.factory';

@Component({
  selector: 'app-simplified-home-wallet',
  template: ` <ion-header>
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
              <ion-text class="ux-font-text-lg" *ngIf="this.tokenDetail">{{ this.tplToken.value }}</ion-text>
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
            USD
          </ion-text>
        </div>
      </div>
      <div class="swt__overlap_buttons" *ngIf="this.tplToken">
        <app-simplified-wallet-subheader-buttons
          [token]="this.tplToken.value"
          [blockchain]="this.tplToken.network"
          (openWarrantyModal)="this.showWarrantyModal()"
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
                  {{ this.warranty.amount * this.tokenDetail.price }} USD
                </ion-label>
                <ion-skeleton-text class="fiat-amount" *ngIf="!this.warranty"></ion-skeleton-text>
              </div>
            </div>
          </div>
          <div class="swt__warranty__card__button">
            <ion-button
              class="ux_button"
              color="secondary"
              (click)="this.showWarrantyModal()"
              appTrackClick
              name="ux_nav_go_to_warrant"
              [disabled]="this.tokenDetail?.balance === 0"
            >
              {{ 'wallets.home.subheader_buttons_component.warranty_card' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
      <div class="swt__whatsapp">
        <app-whatsapp-support></app-whatsapp-support>
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
              [innerHTML]="
                'wallets.simplified_home_wallet.empty_transactions' | translate : { token: this.tplToken.value }
              "
            >
            </ion-label>
          </div>
        </div>
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
  private blockchain: Blockchain;
  private token: Token;
  private wallet: Wallet;
  private _pageUrl: string;
  private lender: Lender;

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
    private fiatRampsService: FiatRampsService,
    private kriptonStorage: KriptonStorageService,
    private activatedRoute: ActivatedRoute,
    private modalFactoryInjectable: ModalFactoryInjectable,
    private notificationsService: NotificationsService,
    private activeLenderInjectable: ActiveLenderInjectable
  ) {}

  async ionViewWillEnter() {
    await this._setLender();
    this._setPageUrl();
    this.subscribeOnHideFunds();
    this.setBlockchain();
    await this.setToken();
    this.formatTokenName();
    await this.setWallet();
    await this.getWarranty();
    await this.setTokenDetail();
    await this.showModal();
    await this.getTransfers();
    this.notificationsService.getInstance().register();
  }

  private _setPageUrl() {
    this._pageUrl = window.location.href;
  }

  private async _setLender() {
    this.lender = await this.activeLenderInjectable.create().value();
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }

  private setBlockchain() {
    this.blockchain = this.blockchainsFactory.create().oneByName(this.lender.blockchain());
    this.tplBlockchain = this.blockchain.json();
  }

  private async setToken() {
    const coin = this.apiWalletService.getCoin(this.lender.token(), this.lender.blockchain());
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
  }

  async showModal() {
    const hasPendingOperations = await this._hasPendingOperations();
    if (this.warranty.amount === 0 && !this._showRegistrationModal()) {
      if (hasPendingOperations && this._hasBalance()) {
        await this._showHasCryptoModal();
      } else if (hasPendingOperations && !this._hasBalance()) {
        await this._showPendingCryptoModal();
      } else if (!hasPendingOperations && this._hasBalance()) {
        await this.showWarrantyModal();
      } else if (!hasPendingOperations && !this._hasBalance()) {
        await this._showWarrantyModalWithBuyOrDepositOpts();
      }
    }
  }

  private _showRegistrationModal(): boolean {
    return !!this.activatedRoute.snapshot.queryParamMap.get('showRegistrationModal');
  }

  private _hasBalance() {
    return this.tokenDetail.balance > 0;
  }

  private async _hasPendingOperations(): Promise<boolean> {
    const auth_token = await this.kriptonStorage.get('access_token');
    const email = await this.kriptonStorage.get('email');
    if (auth_token && email) {
      const operations = await this.fiatRampsService.getUserOperations({ email, auth_token }).toPromise();
      return operations.some((op) => op.status === 'received' && op.operation_type === 'cash-in');
    }
    return false;
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
    this.warranty = await this.warrantiesService
      .verifyWarranty({
        wallet: this.wallet.address(),
        lender: this.lender.json().name,
        currency: this.lender.token(),
        blockchain: this.lender.blockchain(),
      })
      .toPromise();
  }

  private async _showHasCryptoModal() {
    await this.modalFactoryInjectable
      .create()
      .oneBy(Modals.GENERAL_WITH_BUTTON, [
        'warranties.modal_has_crypto.title',
        this.lender.hasCryptoModalDescription(),
        'warranties.modal_has_crypto.button_text',
        '/warranties/send-warranty',
      ])
      .showIn(this._pageUrl);
  }

  private async _showPendingCryptoModal() {
    await this.modalFactoryInjectable
      .create()
      .oneBy(Modals.GENERAL_WITH_BUTTON, [
        'warranties.modal_pending_crypto.title',
        'warranties.modal_pending_crypto.description',
        'warranties.modal_pending_crypto.button_text',
        '',
      ])
      .showIn(this._pageUrl);
  }

  async showWarrantyModal() {
    await this.modalFactoryInjectable
      .create()
      .oneBy(Modals.GENERAL_WITH_TWO_BUTTONS, [
        this.lender.logo(),
        this.lender.infoModalHighlightedHeader(),
        'warranties.modal_info.header',
        'warranties.modal_info.information',
        this.lender.url(),
        'warranties.modal_info.firstButton',
        'ux_warranty_start',
        '/warranties/send-warranty',
        'warranties.modal_info.secondButton',
        'ux_warranty_withdraw',
        '/warranties/withdraw-warranty',
        '',
        true,
      ])
      .showIn(this._pageUrl);
  }

  private async _showWarrantyModalWithBuyOrDepositOpts() {
    await this.modalFactoryInjectable
      .create()
      .oneBy(Modals.GENERAL_WITH_TWO_BUTTONS, [
        this.lender.logo(),
        '',
        this.lender.buyOrDepositModalHeader(),
        'warranties.modal_info.information',
        this.lender.url(),
        'warranties.modal_info_to_buy_or_deposit.firstButton',
        'ux_warranty_buy',
        '/fiat-ramps/purchases',
        'warranties.modal_info_to_buy_or_deposit.secondButton',
        'ux_warranty_receive',
        '/wallets/receive/detail?asset=USDC&network=MATIC',
        'ux_warranty_cancel',
        true,
      ])
      .showIn(this._pageUrl);
  }
}
