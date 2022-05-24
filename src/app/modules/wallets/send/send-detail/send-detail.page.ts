import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { NavController } from '@ionic/angular';
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
import { GasFeeOf } from '../../../defi-investments/shared-defi-investments/models/gas-fee-of/gas-fee-of.model';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { VoidSigner, BigNumber } from 'ethers';
import { ERC20ProviderController } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/controller/erc20-provider.controller';
import { ERC20ContractController } from '../../../defi-investments/shared-defi-investments/models/erc20-contract/controller/erc20-contract.controller';
import { FakeProvider } from '../../../../shared/models/provider/fake-provider.spec';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.interface';
import { parseUnits } from 'ethers/lib/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';

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
              *ngIf="this.balance && this.fee"
              [header]="'defi_investments.shared.amount_input_card.available' | translate"
              [showRange]="false"
              [baseCurrency]="this.token"
              [max]="this.balance - this.fee"
              [quotePrice]="this.quotePrice"
              [feeToken]="this.nativeToken"
            ></app-amount-input-card>
          </ion-card>
        </div>
      </form>

      <div class="sd__alert" *ngIf="!!this.nativeToken && this.nativeBalance === 0">
        <app-ux-alert-message [type]="this.alertType">
          <div class="sd__alert__title">
            <ion-text>{{ 'wallets.send.send_detail.alert.title' | translate }}</ion-text>
          </div>
          <div class="sd__alert__text">
            <ion-text>{{
              'wallets.send.send_detail.alert.text' | translate: { nativeToken: this.nativeToken.value }
            }}</ion-text>
          </div>
        </app-ux-alert-message>
      </div>

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
  private destroy$ = new Subject<void>();
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
  form: FormGroup = this.formBuilder.group({
    address: ['', [Validators.required]],
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
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
    private erc20ContractController: ERC20ContractController
  ) {}

  async ionViewDidEnter() {
    //TODO: agregar skeleton al amount-input
    this.tokenAndNetworks();
    this.dynamicPrice();
    await this.nativeTransferFee();
    await this.tokenBalances();
  }

  private async userWallet() {
    return await this.storageService.getWalletsAddresses(this.selectedNetwork);
  }

  async tokenBalances() {
    this.nativeToken = this.apiWalletService.getNativeTokenFromNetwork(this.selectedNetwork);

    this.nativeBalance = parseFloat(
      await this.walletService.balanceOf(await this.userWallet(), this.nativeToken.value)
    );
    this.balance = parseFloat(await this.walletService.balanceOf(await this.userWallet(), this.token.value));
  }

  private tokenAndNetworks() {
    const coin = this.route.snapshot.queryParamMap.get('asset');
    const network = this.route.snapshot.queryParamMap.get('network');

    this.token = this.apiWalletService.getCoin(coin, network);
    this.networks = this.apiWalletService.getNetworks(coin);
    this.selectedNetwork = network;
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
            to: this.form.value.address,
            value: this.form.value.amount && this.parseWei(this.form.value.amount),
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

  private async tokenContractTransferFee(): Promise<void> {
    this.fee = await new FormattedFee(
      new NativeFeeOf(
        new GasFeeOf((await this.erc20Contract()).value(), 'transfer', [
          await this.userWallet(),
          this.parseWei(this.form.value.amount),
        ]),
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

  async quoteFee(): Promise<string> {
    return (this.fee * (await this.getPrice())).toString();
  }

  async submitForm() {
    if (this.form.valid) {
      if (!this.token.native) await this.tokenContractTransferFee();
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
      referenceFee: await this.quoteFee(),
    };
  }

  changeCurrency() {
    this.navController.navigateBack(['/wallets/send/select-currency']);
  }

  selectedNetworkChanged(network) {
    this.selectedNetwork = network;
  }

  private dynamicPrice() {
    this.createDynamicPrice()
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => (this.quotePrice = price));
  }

  createDynamicPrice(): DynamicPrice {
    return DynamicPrice.create(this.priceRefreshInterval, this.token, this.apiWalletService);
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
