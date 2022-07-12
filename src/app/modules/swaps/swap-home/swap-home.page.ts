import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { WalletPasswordComponent } from '../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { PROD_COINS } from '../../wallets/shared-wallets/constants/coins.prod';
import { Blockchain } from '../shared-swaps/models/blockchain/blockchain';
import { RawBlockchain } from '../shared-swaps/models/blockchain-repo/blockchain-repo';
import { JSONSwapInfo, NullJSONSwapInfo, RawSwapInfo } from '../shared-swaps/models/json-swap-info/json-swap-info';
import { Password } from '../shared-swaps/models/password/password';
import { Referral } from '../shared-swaps/models/referral/referral';
import { StandardizedTokens } from '../shared-swaps/models/standardized-tokens/standardized-tokens';
import { Swap } from '../shared-swaps/models/swap/swap';
import { SwapInfoOf } from '../shared-swaps/models/swap-info-of/swap-info-of';
import { Token } from '../shared-swaps/models/token/token';
import { TokenByAddress } from '../shared-swaps/models/token-by-address/token-by-address';
import { RawToken, TokenRepo } from '../shared-swaps/models/token-repo/token-repo';
import { Tokens } from '../shared-swaps/models/tokens/tokens';
import { Wallet } from '../shared-swaps/models/wallet/wallet';
import { Dex } from '../shared-swaps/models/dex';
import { SwapTransactions } from '../shared-swaps/models/swap-transactions/swpa-transactions';
import { WalletsFactory } from '../shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainsFactory } from '../shared-swaps/models/blockchains/factory/blockchains.factory';
import { OneInchFactory } from '../shared-swaps/models/one-inch/factory/one-inch.factory';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { IntersectedTokensFactory } from '../shared-swaps/models/intersected-tokens/factory/intersected-tokens.factory';
import { SwapTransactionsFactory } from '../shared-swaps/models/swap-transactions/factory/swap-transactions.factory';
import { BlockchainTokens } from '../shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { OneInchTokens } from '../shared-swaps/models/one-inch-tokens/one-inch-tokens';
import { GasStationOf } from '../shared-swaps/models/gas-station-of/gas-station-of';
import { BigNumber } from 'ethers';
import { FeeOf } from '../shared-swaps/models/fee-of/fee-of';
import { FormattedFee } from '../../defi-investments/shared-defi-investments/models/formatted-fee/formatted-fee.model';
import { GasUnits } from '../shared-swaps/models/gas-units/gas-units';
import { NativeTokenOf } from '../shared-swaps/models/native-token-of/native-token-of';
import { BlockchainFee } from '../shared-swaps/models/blockchain-fee/blockchain-fee';

@Component({
  selector: 'app-swap-home',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_round_toolbar">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="this.defaultNavBackUrl"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'swaps.home.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="content sw">
      <div class="sw__swap-card">
        <div class="sw__swap-card__networks ion-padding" *ngIf="this.tplBlockchain">
          <app-network-select-card
            [title]="'wallets.send.send_detail.network_select.network' | translate"
            [networks]="[this.tplBlockchain.name]"
            [disclaimer]=""
            [selectedNetwork]="this.tplBlockchain.name"
          ></app-network-select-card>
        </div>
        <hr />
        <div class="sw__swap-card__from ion-padding">
          <div class="sw__swap-card__from__title">
            <ion-text class="ux-font-text-lg">
              {{ 'swaps.home.from_token_title' | translate }}
            </ion-text>
          </div>
          <div class="sw__swap-card__from__detail">
            <div class="sw__swap-card__from__detail__token">
              <app-coin-selector
                *ngIf="this.tplFromToken"
                [selectedCoin]="this.tplFromToken"
                enabled="true"
                (changeCurrency)="this.selectFromToken()"
              ></app-coin-selector>
            </div>
            <div class="sw__swap-card__from__detail__amount">
              <form [formGroup]="this.form">
                <ion-input
                  appNumberInput
                  class="sw__swap-card__from__detail__amount__input"
                  formControlName="fromTokenAmount"
                  type="number"
                  inputmode="numeric"
                ></ion-input>
              </form>
            </div>
          </div>
        </div>
        <div class="sw__swap-card__icon_area ion-padding-top">
          <hr />
          <div class="sw__swap-card__icon_area__content">
            <div class="sw__swap-card__icon_area__content__icon">
              <ion-icon icon="ux-arrow-narrow-down"></ion-icon>
            </div>
          </div>
          <hr />
        </div>
        <div class="sw__swap-card__to ion-padding-horizontal ion-padding-bottom">
          <div class="sw__swap-card__to__title">
            <ion-text class="ux-font-text-lg">
              {{ 'swaps.home.to_token_title' | translate }}
            </ion-text>
          </div>
          <div class="sw__swap-card__to__detail">
            <div class="sw__swap-card__to__detail__token">
              <app-coin-selector
                *ngIf="this.tplToToken"
                [selectedCoin]="this.tplToToken"
                enabled="true"
                (changeCurrency)="this.selectToToken()"
              ></app-coin-selector>
            </div>
            <div class="sw__swap-card__to__detail__amount">
              <div class="sw__swap-card__to__detail__amount__value">
                <ion-text class="ux-font-text-lg">
                  {{ this.tplSwapInfo.toTokenAmount | formattedAmount }}
                </ion-text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sw__swap-button ion-padding">
        <ion-button
          [appLoading]="this.loadingBtn"
          [loadingText]="'swaps.home.loading_button_text' | translate"
          appTrackClick
          name="ux_swaps_swap"
          class="ux_button sw__swap-button__button"
          color="secondary"
          [disabled]="this.form.invalid || this.disabledBtn"
          (click)="this.swapThem()"
          >{{ 'swaps.home.button' | translate }}</ion-button
        >
      </div>
      <div class="sw__footer" *ngIf="this.loadingBtn">
        <span class="ux-font-text-xs text">
          {{ 'swaps.home.footer_text' | translate }}
        </span>
      </div>
    </ion-content>
  `,
  styleUrls: ['./swap-home.page.scss'],
})
export class SwapHomePage {
  private activeBlockchain: Blockchain;
  private fromToken: Token;
  private toToken: Token;
  private tokens: Tokens;
  private dex: Dex;
  private swap: Swap;
  private referral: Referral = new Referral();
  private fromTokenKey = 'fromToken';
  private toTokenKey = 'toToken';
  private nativeToken: NativeTokenOf;
  loadingBtn: boolean;
  disabledBtn: boolean;
  tplBlockchain: RawBlockchain;
  tplFromToken: RawToken;
  tplToToken: RawToken;
  tplSwapInfo: RawSwapInfo = new NullJSONSwapInfo().value();
  form: FormGroup = this.formBuilder.group({
    fromTokenAmount: ['0', [Validators.required, CustomValidators.greaterThan(0)]],
  });
  defaultNavBackUrl = 'tabs/wallets';
  swapInProgressUrl = 'swaps/swap-in-progress';

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private appStorageService: AppStorageService,
    private httpClient: HttpClient,
    private wallets: WalletsFactory,
    private blockchains: BlockchainsFactory,
    private oneInch: OneInchFactory,
    private intersectedTokens: IntersectedTokensFactory,
    private swapTransactions: SwapTransactionsFactory,
    private trackService: TrackService
  ) {}

  private async setSwapInfo(fromTokenAmount: string) {
    if (fromTokenAmount) {
      this.swap = new Swap(fromTokenAmount, this.fromToken, this.toToken);
    }
    this.tplSwapInfo = await this.jsonSwapInfo(fromTokenAmount);

    // TODO: get native token in order to pass it to transaction fee component

    const currentFee = new BlockchainFee(
      new FeeOf(
        new GasUnits(this.tplSwapInfo.estimatedGas),
        await (new GasStationOf(
          this.activeBlockchain,
          this.httpClient
        ).price()).fast(),
      this.nativeToken
    );

    // console.log(`tx fee: ${await formattedFee.value()} ${(await this.nativeToken.value()).symbol()}`);
  }

  private async jsonSwapInfo(fromTokenAmount: string): Promise<RawSwapInfo> {
    return fromTokenAmount
      ? await new JSONSwapInfo(new SwapInfoOf(this.swap, this.dex, this.referral)).value()
      : new NullJSONSwapInfo().value();
  }

  async ionViewDidEnter() {
    this.trackPage();
    this.subscribeToFromTokenAmountChanges();
    this.setBlockchain(this.route.snapshot.paramMap.get('blockchain'));
    this.setDex();
    this.setTokens();
    this.setNativeToken();
    await this.setTokensToSwap(
      this.route.snapshot.paramMap.get(this.fromTokenKey),
      this.route.snapshot.paramMap.get(this.toTokenKey)
    );
  }

  private subscribeToFromTokenAmountChanges() {
    this.form
      .get('fromTokenAmount')
      .valueChanges.pipe(debounceTime(500))
      .subscribe(async (value) => await this.setSwapInfo(value));
  }

  private trackPage() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_swaps_screenview_home',
    });
  }

  private resetMainButton() {
    this.loadingBtn = false;
    this.disabledBtn = false;
  }

  selectFromToken() {
    this.changeCurrency(this.fromTokenKey);
  }

  selectToToken() {
    this.changeCurrency(this.toTokenKey);
  }

  private changeCurrency(tokenToSelect: string) {
    this.navController.navigateForward([
      'swaps/select-currency/blockchain',
      this.activeBlockchain.name(),
      'from-token',
      this.fromToken.address(),
      'to-token',
      this.toToken.address(),
      'token-to-select',
      tokenToSelect,
    ]);
  }

  private async setTokensToSwap(fromTokenAddress: string, toTokenAddress: string) {
    this.fromToken = await new TokenByAddress(fromTokenAddress, this.tokens).value();
    this.tplFromToken = this.fromToken.json();
    this.toToken = await new TokenByAddress(toTokenAddress, this.tokens).value();
    this.tplToToken = this.toToken.json();
  }

  private setDex() {
    this.dex = this.oneInch.create(this.activeBlockchain, this.httpClient);
  }

  private setTokens() {
    this.tokens = this.intersectedTokens.create(
      this.blockchainTokens(),
      new OneInchTokens(this.dex)
    );
  }

  private setNativeToken() {
    this.nativeToken = new NativeTokenOf(this.blockchainTokens());
  }

  private blockchainTokens(): BlockchainTokens {
    return new BlockchainTokens(this.activeBlockchain, new StandardizedTokens(new TokenRepo(PROD_COINS)));
  }

  private setBlockchain(aBlockchainName: string) {
    this.activeBlockchain = this.blockchains.create().oneByName(aBlockchainName);
    this.tplBlockchain = this.activeBlockchain.json();
  }

  async requestPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      componentProps: {
        state: 'swap',
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.setMainButtonToLoading();
    return new Password(data).value();
  }

  private setMainButtonToLoading() {
    this.loadingBtn = true;
  }

  private disableMainButton() {
    this.disabledBtn = true;
  }

  async swapThem() {
    this.disableMainButton();
    const wallet = await this.wallets.create(this.appStorageService).oneBy(this.activeBlockchain);
    wallet.onNeedPass().subscribe(() => this.requestPassword());
    wallet.onDecryptedWallet().subscribe(() => this.navController.navigateForward([this.swapInProgressUrl]));
    wallet
      .sendTxs(await this.swapTxs(wallet).blockchainTxs())
      .then(() => console.log('Swap OK!'))
      .catch((err) => {
        console.log('Swap NOT OK!');
        console.log(err.message);
        this.resetMainButton();
      });
  }

  private swapTxs(wallet: Wallet): SwapTransactions {
    return this.swapTransactions.create(this.swap, wallet, this.dex);
  }
}
