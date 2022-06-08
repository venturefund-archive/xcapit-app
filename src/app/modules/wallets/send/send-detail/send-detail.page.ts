import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { UX_ALERT_TYPES } from 'src/app/shared/components/ux-alert-message/ux-alert-types';
import { WalletService } from '../../shared-wallets/services/wallet/wallet.service';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../../shared-wallets/services/api-wallet/api-wallet.service';
import { NativeGasOf } from 'src/app/shared/models/native-gas-of/native-gas-of';
import { NativeFeeOf } from 'src/app/modules/defi-investments/shared-defi-investments/models/native-fee-of/native-fee-of.model';
import { FormattedFee } from 'src/app/modules/defi-investments/shared-defi-investments/models/formatted-fee/formatted-fee.model';
import { GasFeeOf } from '../../../../shared/models/gas-fee-of/gas-fee-of.model';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { VoidSigner, BigNumber } from 'ethers';
import { ERC20ProviderController } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/controller/erc20-provider.controller';
import { ERC20ContractController } from '../../../defi-investments/shared-defi-investments/models/erc20-contract/controller/erc20-contract.controller';
import { FakeProvider } from '../../../../shared/models/provider/fake-provider.spec';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.interface';
import { parseUnits } from 'ethers/lib/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicPriceFactory } from '../../../../shared/models/dynamic-price/factory/dynamic-price-factory';
import { Amount } from 'src/app/modules/defi-investments/shared-defi-investments/types/amount.type';
import { ToastWithButtonsComponent } from 'src/app/modules/defi-investments/shared-defi-investments/components/toast-with-buttons/toast-with-buttons.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-send-detail',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/select-currency"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.send.send_detail.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="sd">
      <div class="sd__network-select-card ion-padding" *ngIf="this.networks">
        <div class="sd__network-select-card__title">
          <ion-text class="ux-font-text-lg">{{ 'wallets.send.send_detail.network_select.title' | translate }}</ion-text>
        </div>
        <div class="sd__network-select-card__selected-coin">
          <app-coin-selector [selectedCoin]="this.token" (changeCurrency)="this.changeCurrency()"></app-coin-selector>
        </div>
        <div class="sd__network-select-card__networks" *ngIf="this.selectedNetwork">
          <app-network-select-card
            (networkChanged)="this.selectedNetworkChanged($event)"
            [title]="'wallets.send.send_detail.network_select.network' | translate"
            [networks]="this.networks"
            [disclaimer]="
              'wallets.send.send_detail.network_select.disclaimer'
                | translate
                  : {
                      network: this.selectedNetwork
                    }
            "
            [selectedNetwork]="this.selectedNetwork"
          ></app-network-select-card>
        </div>
      </div>

      <form [formGroup]="this.form">
        <div class="sd__address-input-card  ion-padding-start ion-padding-end" *ngIf="this.token">
          <app-address-input-card
            [title]="'wallets.send.send_detail.address_input.title' | translate"
            [helpText]="'wallets.send.send_detail.address_input.help_text' | translate: { currency: this.token.value }"
          ></app-address-input-card>
        </div>
        <div class="sd__amount-input-card" *ngIf="this.token">
          <ion-card class="ux-card">
            <app-amount-input-card
              *ngIf="this.balance !== undefined && (!this.token.native || (this.token.native && this.fee))"
              [header]="'defi_investments.shared.amount_input_card.available' | translate"
              [showRange]="false"
              [baseCurrency]="this.token"
              [max]="this.balance"
              [quotePrice]="this.quotePrice"
              [feeToken]="this.nativeToken"
            ></app-amount-input-card>
            <app-amount-input-card-skeleton
              *ngIf="this.balance === undefined || (this.token.native && !this.fee)"
              [showRange]="false"
            ></app-amount-input-card-skeleton>
            <div class="ion-padding-start ion-padding-end">
              <app-transaction-fee
                [fee]="this.dynamicFee"
                [quoteFee]="this.quoteFee"
                [balance]="this.balance"
                [description]="'donations.send_donations.description_fee' | translate"
              ></app-transaction-fee>
            </div>
          </ion-card>
        </div>
      </form>

      <div class="sd__submit-button ion-padding">
        <ion-button
          class="ux_button sd__submit-button__button"
          appTrackClick
          name="ux_send_continue"
          (click)="this.submitForm()"
          [disabled]="!this.form.valid || !this.selectedNetwork"
          color="secondary"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-content>
  `,
  styleUrls: ['./send-detail.page.scss'],
})
export class SendDetailPage {
  destroy$ = new Subject<void>();
  private priceRefreshInterval = 15000;
  alertType = UX_ALERT_TYPES.warning;
  token: Coin;
  nativeToken: Coin;
  networks: string[];
  selectedNetwork: string;
  nativeBalance: number;
  balance: number;
  amount: number;
  quotePrice: number;
  fee: number;
  dynamicFee: Amount = { value: undefined, token: undefined };
  quoteFee: Amount = { value: undefined, token: 'USD' };
  modalHref: string;
  form: FormGroup = this.formBuilder.group({
    address: ['', [Validators.required]],
    amount: [0, [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
  });

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private transactionDataService: TransactionDataService,
    private walletService: WalletService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private erc20ProviderController: ERC20ProviderController,
    private erc20ContractController: ERC20ContractController,
    private dynamicPriceFactory: DynamicPriceFactory,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  async ionViewDidEnter() {
    this.modalHref = window.location.href;
    this.tokenAndNetworks();
    this.dynamicPrice();
    await this.getFee();
    await this.tokenBalances();
    await this.checkBalance();
  }

  private async userWallet(): Promise<string> {
    return await this.storageService.getWalletsAddresses(this.selectedNetwork);
  }

  async tokenBalances() {
    this.nativeBalance = parseFloat(
      await this.walletService.balanceOf(await this.userWallet(), this.nativeToken.value)
    );
    const rawBalance = parseFloat(await this.walletService.balanceOf(await this.userWallet(), this.token.value));
    this.balance = this.token.native ? rawBalance - this.fee : rawBalance;
  }

  private tokenAndNetworks() {
    const coin = this.route.snapshot.queryParamMap.get('asset');
    const network = this.route.snapshot.queryParamMap.get('network');

    this.token = this.apiWalletService.getCoin(coin, network);
    this.networks = this.apiWalletService.getNetworks(coin);
    this.selectedNetwork = network;
    this.nativeToken = this.apiWalletService.getNativeTokenFromNetwork(this.selectedNetwork);
  }

  private async getFee(): Promise<void> {
    this.token.native ? await this.nativeTransferFee() : await this.nonNativeTransferFee();
    this.dynamicFee = { value: this.fee, token: this.nativeToken.value };
    this.getQuoteFee();
  }

  async erc20Contract(): Promise<ERC20Contract> {
    return this.erc20ContractController.new(this.erc20Provider(), new VoidSigner(await this.userWallet()));
  }

  erc20Provider(): ERC20Provider {
    return this.erc20ProviderController.new(this.token);
  }

  private async nativeTransferFee(): Promise<void> {
    if (this.token.native) {
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
  }

  private async gasPrice(): Promise<BigNumber> {
    return await this.apiWalletService
      .getGasPrice()
      .toPromise()
      .then((res) => res.gas_price);
  }

  private async nonNativeTransferFee(): Promise<void> {
    this.fee = await new FormattedFee(
      new NativeFeeOf(
        new GasFeeOf((await this.erc20Contract()).value(), 'transfer', [await this.userWallet(), this.parseWei(1)]),
        new FakeProvider(await this.gasPrice())
      )
    ).value();
  }

  parseWei(amount: number) {
    return parseUnits(amount.toFixed(this.token.decimals), this.token.decimals);
  }

  async getPrice(): Promise<number> {
    const prices = (await this.apiWalletService.getPrices([this.token.value], false).toPromise()).prices;
    return prices[this.token.value];
  }

  async submitForm() {
    if (this.form.valid) {
      await this.saveTransactionData();
      await this.goToSummary();
    }
  }

  async goToSummary() {
    await this.navController.navigateForward(['/wallets/send/summary']);
  }

  private async saveTransactionData() {
    this.transactionDataService.transactionData = {
      network: this.selectedNetwork,
      currency: this.token,
      address: this.form.value.address,
      amount: this.form.value.amount,
      referenceAmount: this.form.value.quoteAmount,
      balanceNativeToken: this.nativeBalance,
      balance: this.balance,
      fee: this.fee.toString(),
      referenceFee: this.quoteFee.value.toString(),
    };
  }

  changeCurrency() {
    this.navController.navigateBack(['/wallets/send/select-currency']);
  }

  selectedNetworkChanged(network) {
    this.selectedNetwork = network;
  }

  private dynamicPrice() {
    this.dynamicPriceFactory
      .new(this.priceRefreshInterval, this.token, this.apiWalletService)
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => {
        this.quotePrice = price;
        this.getQuoteFee();
      });
  }

  private getQuoteFee() {
    return (this.quoteFee.value = this.quotePrice * this.fee);
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async checkBalance() {
    this.token.native ? await this.nativeTransferFee() : await this.nonNativeTransferFee();
    if (this.balance < this.fee) this.openModalBalance();
  }

  async openModalBalance() {
    const modal = await this.modalController.create({
      component: ToastWithButtonsComponent,
      cssClass: 'ux-toast-warning',
      showBackdrop: false,
      id: 'feeModal',
      componentProps: {
        text: this.translate.instant('defi_investments.confirmation.informative_modal_fee', {
          nativeToken: this.nativeToken?.value,
        }),
        firstButtonName: this.translate.instant('defi_investments.confirmation.buy_button', {
          nativeToken: this.nativeToken?.value,
        }),
        secondaryButtonName: this.translate.instant('defi_investments.confirmation.deposit_button', {
          nativeToken: this.nativeToken?.value,
        }),
        firstLink: '/fiat-ramps/new-operation/moonpay',
        secondLink: '/wallets/receive/detail',
        data: this.nativeToken,
      },
    });
    await this.modalController.dismiss(null, null, 'feeModal');
    if (window.location.href === this.modalHref) {
      await modal.present();
    }
  }
}
