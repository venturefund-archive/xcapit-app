import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CAUSES } from '../shared-donations/constants/causes';
import { Subject } from 'rxjs';
import { Amount } from '../../defi-investments/shared-defi-investments/types/amount.type';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { BigNumber } from 'ethers';
import { ERC20Provider } from '../../defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.interface';
import { FormattedFee } from '../../defi-investments/shared-defi-investments/models/formatted-fee/formatted-fee.model';
import { NativeFeeOf } from '../../defi-investments/shared-defi-investments/models/native-fee-of/native-fee-of.model';
import { NativeGasOf } from 'src/app/shared/models/native-gas-of/native-gas-of';
import { FakeProvider } from 'src/app/shared/models/provider/fake-provider.spec';
import { ERC20ProviderController } from '../../defi-investments/shared-defi-investments/models/erc20-provider/controller/erc20-provider.controller';
import { takeUntil } from 'rxjs/operators';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { SendDonationDataService } from '../shared-donations/services/send-donation-data.service';
import { ModalController, NavController } from '@ionic/angular';
import { ToastWithButtonsComponent } from '../../defi-investments/shared-defi-investments/components/toast-with-buttons/toast-with-buttons.component';
import { TranslateService } from '@ngx-translate/core';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { parseUnits } from 'ethers/lib/utils';

@Component({
  selector: 'app-send-donation',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/donations/description-cause"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'donations.send_donations.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="sd ion-padding">
      <div *ngIf="this.cause">
        <div class="ux-card ion-padding">
          <div class="sd__network-select-card">
            <div class="sd__network-select-card__title">
              <ion-text class="ux-font-text-lg">{{ 'donations.send_donations.title' | translate }}</ion-text>
            </div>
            <div class="sd__network-select-card__selected-coin">
              <div class="sd__label">
                <ion-label class="ux-font-titulo-xs">{{ 'donations.send_donations.currency' | translate }}</ion-label>
              </div>
              <div class="sd__selector">
                <ion-item class="sd__selector__item ion-no-padding ion-no-margin" lines="none">
                  <div class="sd__selector__item__logo">
                    <img [src]="this.token.logoRoute" alt="logo" />
                  </div>
                  <ion-label class="sd__selector__item__label ion-no-margin" color="neutral90">{{
                    this.token.value
                  }}</ion-label>
                </ion-item>
              </div>
            </div>
            <div class="sd__network-select-card__networks" *ngIf="this.selectedNetwork">
              <app-network-select-card
                [title]="'donations.send_donations.network' | translate"
                [selectedNetwork]="this.selectedNetwork"
                [networks]="this.networks"
                [disclaimer]="
                  'donations.send_donations.disclaimer'
                    | translate
                      : {
                          network: this.selectedNetwork
                        }
                "
              ></app-network-select-card>
            </div>
          </div>
        </div>
        <form [formGroup]="this.form">
          <div class="sd__send-amount-card ux-card ion-padding">
            <div class="sd__send-amount-card__title">
              <ion-text class="ux-font-titulo-xs">Billetera de destino</ion-text>
            </div>
            <div class="sd__send-amount-card__address ux-card">
              {{ this.cause.address }}
            </div>
            <div>
              <ion-text class="ux-font-text-xxs">Dirección o alias</ion-text>
            </div>
          </div>
          <div class="sd__send-amount-card ux-card">
            <app-amount-input-card
              *ngIf="this.balance !== undefined && (!this.token.native || (this.token.native && this.fee))"
              [label]="'donations.send_donations.label' | translate"
              [header]="'defi_investments.shared.amount_input_card.available' | translate"
              [baseCurrency]="this.token"
              [quotePrice]="this.quotePrice"
              [showRange]="false"
              [disclaimer]="false"
              [max]="this.balance"
              [feeToken]="this.token"
            ></app-amount-input-card>
            <app-amount-input-card-skeleton
              *ngIf="this.balance === undefined || (this.token.native && !this.fee)"
              [showRange]="false"
            ></app-amount-input-card-skeleton>
            <div class="sd__send-amount-card__info">
              <app-transaction-fee
                [fee]="this.dynamicFee"
                [quoteFee]="this.quoteFee"
                [balance]="this.balance"
                [description]="'donations.send_donations.description_fee' | translate"
              ></app-transaction-fee>
            </div>
          </div>
        </form>
      </div>
      <div class="sd__submit-button">
        <ion-button
          class="ux_button sd__submit-button__button"
          appTrackClick
          name="ux_donations_amount"
          [disabled]="!this.form.valid || !this.quoteFee.value"
          color="secondary"
          expand="block"
          (click)="this.submitForm()"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-content>
  `,
  styleUrls: ['./send-donation.page.scss'],
})
export class SendDonationPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
  });

  selectedNetwork: string;
  leave$ = new Subject<void>();
  networks = [];
  cause: any;
  token: Coin;
  fee: number;
  causes = CAUSES;
  dynamicFee: Amount = { value: undefined, token: 'ETH' };
  quoteFee: Amount = { value: undefined, token: 'USD' };
  balance: number;
  quotePrice: number;
  private readonly priceRefreshInterval = 15000;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private sendDonationData: SendDonationDataService,
    private walletService: WalletService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private erc20ProviderController: ERC20ProviderController,
    private modalController: ModalController,
    private translate: TranslateService,
    private dynamicPriceFactory: DynamicPriceFactory
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.walletService.walletExist();
    this.getCause();
    this.setTokens();
    this.setNetwork();
    this.dynamicPrice();
    await this.nativeTransferFee();
    await this.tokenBalance();
    this.checkAvailableBalance();
  }

  getCause() {
    const causeIDParam = this.route.snapshot.queryParamMap.get('cause');

    this.cause = this.causes.find((cause) => (cause.id === causeIDParam ? causeIDParam : this.sendDonationData.cause));
    this.sendDonationData.cause = this.cause.id;
  }

  setNetwork() {
    this.selectedNetwork = this.cause.token.network;
    this.networks = [this.cause.token.network];
  }

  setTokens() {
    this.token = this.apiWalletService
      .getCoins()
      .find((coin: Coin) => coin.value === this.cause.token.value && coin.network === this.cause.token.network);
  }

  async tokenBalance() {
    const walletAddress = await this.storageService.getWalletsAddresses(this.selectedNetwork);

    const rawBalance = parseFloat(await this.walletService.balanceOf(walletAddress, this.token.value));
    this.balance = this.token.native ? Math.max(rawBalance - this.fee, 0) : rawBalance;
  }

  erc20Provider(): ERC20Provider {
    return this.erc20ProviderController.new(this.token);
  }

  private async gasPrice(): Promise<BigNumber> {
    return await this.apiWalletService
      .getGasPrice()
      .toPromise()
      .then((res) => res.gas_price);
  }

  private async nativeTransferFee(): Promise<void> {
    if (this.token.native) {
      this.fee = await new FormattedFee(
        new NativeFeeOf(
          new NativeGasOf(this.erc20Provider(), {
            to: this.form.value.address,
            value: this.form.value.amount && this.parseWei(this.form.value.amount),
          }),
          new FakeProvider(await this.gasPrice())
        ),
        this.token.decimals
      ).value();
      this.dynamicFee.value = this.fee;
    }
  }

  parseWei(amount: number) {
    return parseUnits(amount.toFixed(this.token.decimals), this.token.decimals);
  }

  private dynamicPrice() {
    this.dynamicPriceFactory
      .new(this.priceRefreshInterval, this.token, this.apiWalletService)
      .value()
      .pipe(takeUntil(this.leave$))
      .subscribe((price: number) => {
        this.quotePrice = price;
        this.quoteFee.value = this.quotePrice * this.fee;
      });
  }

  private saveDonationData() {
    this.sendDonationData.data = {
      network: this.selectedNetwork,
      currency: this.token,
      address: this.cause.address,
      amount: this.form.value.amount,
      referenceAmount: this.form.value.quoteAmount,
      balanceNativeToken: this.balance,
      balance: this.balance,
      fee: this.fee.toString(),
      referenceFee: this.quoteFee.value.toString(),
    };
  }

  goToSummary() {
    this.navController.navigateForward(['/donations/summary-data']);
  }

  submitForm() {
    if (this.form.valid) {
      this.saveDonationData();
      this.goToSummary();
    }
  }

  checkAvailableBalance() {
    if (this.balance === 0) {
      this.openModalNativeTokenBalance();
    }
  }

  async openModalNativeTokenBalance() {
    const modal = await this.modalController.create({
      component: ToastWithButtonsComponent,
      cssClass: 'ux-toast-warning',
      showBackdrop: false,
      componentProps: {
        text: this.translate.instant('defi_investments.confirmation.informative_modal_fee', {
          nativeToken: this.token.value,
        }),
        firstButtonName: this.translate.instant('defi_investments.confirmation.buy_button', {
          nativeToken: this.token.value,
        }),
        secondaryButtonName: this.translate.instant('defi_investments.confirmation.deposit_button', {
          nativeToken: this.token.value,
        }),
        firstLink: '/fiat-ramps/select-provider',
        secondLink: '/wallets/receive/detail',
        data: this.token,
      },
    });
    modal.present();
  }
}
