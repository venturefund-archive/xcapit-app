import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CAUSES } from '../shared-donations/constants/causes';
import { Subject } from 'rxjs';
import { Amount } from '../../defi-investments/shared-defi-investments/types/amount.type';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { BigNumber, VoidSigner } from 'ethers';
import { ERC20Provider } from '../../defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.interface';
import { FormattedFee } from '../../defi-investments/shared-defi-investments/models/formatted-fee/formatted-fee.model';
import { NativeFeeOf } from '../../defi-investments/shared-defi-investments/models/native-fee-of/native-fee-of.model';
import { NativeGasOf } from 'src/app/shared/models/native-gas-of/native-gas-of';
import { FakeProvider } from 'src/app/shared/models/provider/fake-provider.spec';
import { ERC20ProviderController } from '../../defi-investments/shared-defi-investments/models/erc20-provider/controller/erc20-provider.controller';
import { takeUntil } from 'rxjs/operators';
import { SendDonationDataService } from '../shared-donations/services/send-donation-data.service';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { parseUnits } from 'ethers/lib/utils';
import { TokenOperationDataService } from '../../fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';
import { GasFeeOf } from '../../../shared/models/gas-fee-of/gas-fee-of.model';
import { ERC20Contract } from '../../defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { ERC20ContractController } from '../../defi-investments/shared-defi-investments/models/erc20-contract/controller/erc20-contract.controller';
import { BuyOrDepositTokenToastComponent } from '../../fiat-ramps/shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { DefaultToken } from '../../swaps/shared-swaps/models/token/token';
import { RawToken } from '../../swaps/shared-swaps/models/token-repo/token-repo';

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
              ></app-transaction-fee>
            </div>
          </div>
        </form>
      </div>
    </ion-content>
    <ion-footer class="sd__footer">
      <div class="sd__footer__submit-button ion-padding">
        <ion-button
          class="ux_button sd__footer__submit-button__button"
          appTrackClick
          name="ux_donations_amount"
          [disabled]="!this.form.valid || !this.quoteFee.value"
          color="secondary"
          expand="block"
          (click)="this.submitForm()"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-footer>
  `,
  styleUrls: ['./send-donation.page.scss'],
})
export class SendDonationPage implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    amount: [0, [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
  });

  selectedNetwork: string;
  leave$ = new Subject<void>();
  networks = [];
  cause: any;
  token: Coin;
  fee: number;
  causes = CAUSES;
  dynamicFee: Amount = { value: 0, token: undefined };
  quoteFee: Amount = { value: 0, token: 'USD' };
  balance: number;
  quotePrice: number;
  nativeToken: Coin;
  modalHref: string;
  private readonly priceRefreshInterval = 15000;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private formBuilder: UntypedFormBuilder,
    private sendDonationData: SendDonationDataService,
    private walletService: WalletService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private erc20ProviderController: ERC20ProviderController,
    private erc20ContractController: ERC20ContractController,
    private modalController: ModalController,
    private translate: TranslateService,
    private dynamicPriceFactory: DynamicPriceFactory,
    private tokenOperationDataService: TokenOperationDataService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.modalHref = window.location.href;
    await this.walletService.walletExist();
    this.getCause();
    this.setNetwork();
    this.setTokens();
    this.dynamicPrice();
    await this.getFee();
    await this.tokenBalance();
    this.checkAvailableBalance();
  }

  getCause() {
    const causeIDParam = this.route.snapshot.queryParamMap.get('cause');
    this.cause = this.causes.find((cause) => cause.id === (causeIDParam ? causeIDParam : this.sendDonationData.cause));
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
    this.nativeToken = this.token.native
      ? this.token
      : this.apiWalletService.getNativeTokenFromNetwork(this.selectedNetwork);
    this.dynamicFee.token = this.nativeToken.value;
  }

  private async userWallet(): Promise<string> {
    return await this.storageService.getWalletsAddresses(this.selectedNetwork);
  }

  async tokenBalance() {
    const tokenBalance = parseFloat(await this.walletService.balanceOf(await this.userWallet(), this.token.value, this.token.network));
    this.balance = this.token.native ? Math.max(tokenBalance - this.fee, 0) : tokenBalance;
    this.addLowerThanValidator();
  }
  private addLowerThanValidator() {
    this.form.get('amount').addValidators(CustomValidators.lowerThanEqual(this.balance));
    this.form.get('amount').updateValueAndValidity();
  }

  erc20Provider(): ERC20Provider {
    return this.erc20ProviderController.new(this.token);
  }

  private async gasPrice(): Promise<BigNumber> {
    return BigNumber.from(await this.apiWalletService.getGasPrice());
  }

  private async getFee(): Promise<void> {
    this.loadingFee();
    this.token.native ? await this.nativeTransferFee() : await this.nonNativeTransferFee();
    this.dynamicFee = { value: this.fee, token: this.nativeToken.value };
    this.getQuoteFee();
    this.checkAvailableBalance();
  }

  private loadingFee(): void {
    this.dynamicFee.value = this.quoteFee.value = undefined;
  }

  async erc20Contract(): Promise<ERC20Contract> {
    return this.erc20ContractController.new(this.erc20Provider(), new VoidSigner(await this.userWallet()));
  }

  private async nonNativeTransferFee(): Promise<void> {
    this.fee = await new FormattedFee(
      new NativeFeeOf(
        new GasFeeOf((await this.erc20Contract()).value(), 'transfer', [
          this.cause.address,
          this.parseWei(this.form.value.amount),
        ]),
        new FakeProvider(await this.gasPrice())
      )
    ).value();
  }

  private async nativeTransferFee(): Promise<void> {
    this.fee = await new FormattedFee(
      new NativeFeeOf(
        new NativeGasOf(this.erc20Provider(), {
          to: await this.userWallet(),
          value: this.parseWei(1),
        }),
        new FakeProvider(await this.gasPrice())
      ),
      this.token.decimals
    ).value();
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
      });
  }

  private getQuoteFee(): void {
    this.quoteFee.value = this.quotePrice * this.fee;
  }

  private saveDonationData() {
    this.sendDonationData.data = {
      network: this.selectedNetwork,
      currency: this.token,
      address: this.cause.address,
      amount: parseFloat(this.form.value.amount),
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
      component: BuyOrDepositTokenToastComponent,
      cssClass: 'ux-toast-warning-with-margin',
      showBackdrop: false,
      id: 'feeModal',
      componentProps: {
        text: 'defi_investments.confirmation.informative_modal_fee',
        primaryButtonText: 'defi_investments.confirmation.buy_button',
        secondaryButtonText: 'defi_investments.confirmation.deposit_button',
        token: new DefaultToken(this.token as RawToken),
      },
    });
    if (window.location.href === this.modalHref) {
      await modal.present();
    }
    await modal.onDidDismiss();
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }
}
