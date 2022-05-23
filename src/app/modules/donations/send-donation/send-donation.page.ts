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
      <div *ngIf="this.data">
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
                    <img [src]="this.data.token.logoRoute" alt="logo" />
                  </div>
                  <ion-label class="sd__selector__item__label ion-no-margin" color="neutral90">{{
                    this.data.token.value
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
              {{ this.data.address }}
            </div>
            <div>
              <ion-text class="ux-font-text-xxs">Dirección o alias</ion-text>
            </div>
          </div>
          <div class="sd__send-amount-card ux-card">
            <app-amount-input-card
              [label]="'donations.send_donations.label' | translate"
              [header]="'defi_investments.shared.amount_input_card.available' | translate"
              [baseCurrency]="this.token"
              [nativeFee]="this.fee"
              [disclaimer]="false"
            ></app-amount-input-card>
            <div class="sd__send-amount-card__info">
              <app-transaction-fee
                [fee]="this.dynamicFee"
                [quoteFee]="this.quoteFee"
                [nativeTokenBalance]="this.balance"
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
  networks = [];
  cause;
  data;
  token: Coin;
  fee;
  causes = CAUSES;
  dynamicFee: Amount = { value: undefined, token: 'ETH' };
  quoteFee: Amount = { value: undefined, token: 'USD' };
  balance: number;
  leave$ = new Subject<void>();
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
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.walletService.walletExist();
    this.cause = this.route.snapshot.queryParamMap.get('cause');
    this.sendDonationData.cause = this.cause;
    this.getData();
    this.setToken();
    this.setNetwork();
    await this.nativeTransferFee();
    await this.tokenBalance();
    this.dynamicPrice();
    this.checkAvailableBalance();
  }

  getData() {
    this.data = this.causes.find((cause) => cause.id === this.cause);
  }

  setNetwork() {
    this.selectedNetwork = this.data.token.network;
    this.networks = [this.data.token.network];
  }

  setToken() {
    if (this.data) {
      this.token = this.data.token;
    }
  }

  async tokenBalance() {
    const walletAddress = await this.storageService.getWalletsAddresses(this.selectedNetwork);
    this.balance = parseFloat(await this.walletService.balanceOf(walletAddress, this.data.token.value));
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
            value: this.form.value.amount,
          }),
          new FakeProvider(await this.gasPrice())
        ),
        this.token.decimals
      ).value();
      this.dynamicFee.value = this.fee;
    }
  }

  private dynamicPrice() {
    this.createDynamicPrice()
      .value()
      .pipe(takeUntil(this.leave$))
      .subscribe((price: number) => {
        this.quoteFee.value = price * this.fee;
      });
  }

  createDynamicPrice(): DynamicPrice {
    return DynamicPrice.create(this.priceRefreshInterval, this.token, this.apiWalletService);
  }

  private saveDonationData() {
    this.sendDonationData.data = {
      network: this.selectedNetwork,
      currency: this.token,
      address: this.data.address,
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
    if (this.balance < this.fee) {
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
          nativeToken: this.data.token.value,
        }),
        firstButtonName: this.translate.instant('defi_investments.confirmation.buy_button', {
          nativeToken: this.data.token.value,
        }),
        secondaryButtonName: this.translate.instant('defi_investments.confirmation.deposit_button', {
          nativeToken: this.data.token.value,
        }),
        firstLink: '/fiat-ramps/moonpay',
        secondLink: '/wallets/receive/detail',
        data: this.data.token,
      },
    });
    modal.present();
  }
}
