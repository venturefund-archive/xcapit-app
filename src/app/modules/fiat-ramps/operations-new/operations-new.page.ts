import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { BrowserService } from '../../../shared/services/browser/browser.service';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DynamicKriptonPriceFactory } from '../shared-ramps/models/kripton-price/factory/dynamic-kripton-price-factory';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { ProviderTokensOf } from '../shared-ramps/models/provider-tokens-of/provider-tokens-of';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { CoinSelectorModalComponent } from '../shared-ramps/components/coin-selector-modal/coin-selector-modal.component';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';
import { DynamicKriptonPrice } from '../shared-ramps/models/kripton-price/dynamic-kripton-price';
import { DefaultKriptonPrice } from '../shared-ramps/models/kripton-price/default-kripton-price';
import { takeUntil } from 'rxjs/operators';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
@Component({
  selector: 'app-operations-new',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/select-provider"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.new_operation.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="this.form" class="ux_main">
        <div class="ux_content aon">
          <app-provider-new-operation-card
            *ngIf="this.selectedCurrency && this.fiatCurrency"
            [coin]="this.selectedCurrency"
            [fiatCurrency]="this.fiatCurrency"
            [provider]="this.provider"
            [coinSelectorEnabled]="true"
            [minimumFiatAmount]="this.minimumFiatAmount"
            (changeCurrency)="this.openModal($event)"
            paymentType="fiat_ramps.shared.constants.payment_types.kripton"
          ></app-provider-new-operation-card>

          <div class="aon__disclaimer">
            <ion-item class="aon__disclaimer__item ion-no-padding ion-no-margin">
              <ion-checkbox formControlName="thirdPartyKYC" mode="md" slot="start"></ion-checkbox>
              <ion-label class="ion-no-padding ion-no-margin">
                <ion-text class="ux-font-text-xxs" color="neutral80">
                  {{ 'fiat_ramps.new_operation.thirdPartyKYC' | translate }}
                </ion-text>
              </ion-label>
            </ion-item>

            <ion-item class="aon__disclaimer__item ion-no-padding ion-no-margin">
              <ion-checkbox formControlName="thirdPartyTransaction" mode="md" slot="start"></ion-checkbox>
              <ion-label class="ion-no-padding ion-no-margin checkbox-link">
                <ion-text class="ux-font-text-xxs" color="neutral80">
                  {{ 'fiat_ramps.new_operation.thirdPartyTransaction' | translate }}
                </ion-text>
              </ion-label>
            </ion-item>

            <ion-item class="aon__disclaimer__item ion-no-padding ion-no-margin">
              <ion-checkbox formControlName="acceptTOSAndPrivacyPolicy" mode="md" slot="start"></ion-checkbox>
              <ion-label
                class="ion-no-padding ion-no-margin ux-font-text-xxs"
                color="neutral80"
                [innerHTML]="'fiat_ramps.new_operation.privacyPolicyAndTOS' | translate"
              >
              </ion-label>
            </ion-item>
          </div>
        </div>
      </form>
    </ion-content>
    <ion-footer>
      <div class="ux_footer ion-padding">
        <div class="button-next">
          <ion-button
            class="ux_button"
            appTrackClick
            (click)="this.handleSubmit()"
            name="ux_buy_kripton_continue"
            color="secondary"
            size="large"
            [disabled]="!this.form.valid"
          >
            {{ 'fiat_ramps.new_operation.next_button' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./operations-new.page.scss'],
})
export class OperationsNewPage implements AfterViewInit {
  anchors: any;
  provider: FiatRampProvider;
  providerTokens: Coin[];
  selectedCurrency: Coin;
  fiatCurrency: string;
  country: FiatRampProviderCountry;
  fiatPrice: number;
  priceRefreshInterval = 15000;
  destroy$: Subject<void>;
  minimumFiatAmount: number;
  form: UntypedFormGroup = this.formBuilder.group({
    cryptoAmount: ['', [Validators.required]],
    fiatAmount: ['', [Validators.required]],
    thirdPartyKYC: [false, [Validators.requiredTrue]],
    thirdPartyTransaction: [false, [Validators.requiredTrue]],
    acceptTOSAndPrivacyPolicy: [false, [Validators.requiredTrue]],
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: UntypedFormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private storageOperationService: StorageOperationService,
    private walletEncryptionService: WalletEncryptionService,
    private apiWalletService: ApiWalletService,
    private elementRef: ElementRef,
    private browserService: BrowserService,
    private http: HttpClient,
    private kriptonDynamicPrice: DynamicKriptonPriceFactory,
    private providers: ProvidersFactory,
    private tokenOperationDataService: TokenOperationDataService,
    private modalController: ModalController,
    private kriptonStorageService: KriptonStorageService
  ) {}

  ngAfterViewInit() {
    this.anchors = this.elementRef.nativeElement.querySelectorAll('a');
    this.anchors.forEach((anchor) => {
      anchor.addEventListener('click', this.handleAnchorClick.bind(this));
    });
  }

  handleAnchorClick(event: Event) {
    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    this.navigateToLink(anchor.getAttribute('href'));
  }

  async navigateToLink(link) {
    await this.browserService.open({
      url: link,
    });
  }

  ionViewWillEnter() {
    this.destroy$ = new Subject<void>();
    this.provider = this.getProviders().byAlias('kripton');
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.availableCoins();
    this.setCountry();
    this.setCurrency();
    this.subscribeToFormChanges();
    this.dynamicPrice();
  }

  availableCoins() {
    this.providerTokens = new ProviderTokensOf(this.getProviders(), this.apiWalletService.getCoins()).byAlias(
      'kripton'
    );
  }

  getProviders() {
    return this.providers.create();
  }

  subscribeToFormChanges() {
    this.form.get('cryptoAmount').valueChanges.subscribe((value) => {
      this.cryptoAmountChange(value);
    });
    this.form.get('fiatAmount').valueChanges.subscribe((value) => this.fiatAmountChange(value));
  }

  private cryptoAmountChange(value: number) {
    this.form.patchValue({ fiatAmount: value * this.fiatPrice }, { emitEvent: false, onlySelf: true });
  }

  private fiatAmountChange(value: number) {
    this.form.patchValue({ cryptoAmount: value / this.fiatPrice }, { emitEvent: false, onlySelf: true });
  }

  updateAmounts(): void {
    this.form.patchValue({ fiatAmount: this.form.value.cryptoAmount * this.fiatPrice });
  }

  private addDefaultValidators() {
    this.form.get('fiatAmount').addValidators(Validators.required);
  }

  private clearValidators() {
    this.form.get('fiatAmount').clearValidators();
  }
  private addGreaterThanValidator(amount: number) {
    this.clearValidators();
    this.addDefaultValidators();
    this.form.get('fiatAmount').addValidators(CustomValidators.greaterOrEqualThan(amount));
    this.form.get('fiatAmount').updateValueAndValidity();
  }

  private async dynamicPrice() { 
    this.createKriptonDynamicPrice()
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => {
        this.fiatPrice = price;
        if (this.form.value.fiatAmount) this.updateAmounts();
        if (!this.minimumFiatAmount) this.getMinimumFiatAmount();
      });
  }

  private _getUserEmail() {
    return this.kriptonStorageService.get('email');
  }
  private async getMinimumFiatAmount() {
    const data = { email: await this._getUserEmail() };
    const response = await this.fiatRampsService.getKriptonMinimumAmount(this.fiatCurrency, data).toPromise();
    this.minimumFiatAmount = parseFloat(response.minimun_general);
    this.addGreaterThanValidator(this.minimumFiatAmount);
    this.patchFormValue();
  }

  private patchFormValue() {
    this.form.patchValue({ fiatAmount: this.minimumFiatAmount, cryptoAmount: this.minimumFiatAmount / this.fiatPrice });
  }

  createKriptonDynamicPrice(currency = this.fiatCurrency): DynamicKriptonPrice {
    return this.kriptonDynamicPrice.new(
      this.priceRefreshInterval,
      new DefaultKriptonPrice(currency, this.selectedCurrency, this.http)
    );
  }

  setCountry() {
    this.country = COUNTRIES.find(
      (country) => country.isoCodeAlpha3 === this.tokenOperationDataService.tokenOperationData.country
    );
  }

  async setCurrency() {
    const { asset, network } = this.tokenOperationDataService.tokenOperationData;
    this.selectedCurrency = this.providerTokens.find(
      (currency) => currency.value === asset && currency.network === network
    );
    this.fiatCurrency = this.country.fiatCode ? this.country.fiatCode : 'USD';
  }

  async handleSubmit() {
    if (this.form.valid) {
      await this.setOperationStorage();
      const email = await this.kriptonStorageService.get('email');
      this.kriptonStorageService.set('privacy_and_policy_accepted', true);
      const operationData = Object.assign({ email }, this.storageOperationService.getData());
      const operationResponse = await this.fiatRampsService.createOperation(operationData).toPromise();

      const newData = Object.assign(
        { operation_id: operationResponse.id, created_at: operationResponse.created_at },
        this.storageOperationService.getData()
      );
      this.storageOperationService.updateData(newData);
      this.navController.navigateRoot('/fiat-ramps/purchase-order/1');
    } else {
      this.form.markAllAsTouched();
    }
  }

  async setOperationStorage() {
    const data: OperationDataInterface = {
      country: this.country.name,
      type: 'cash-in',
      amount_in: this.form.value.fiatAmount,
      amount_out: this.form.value.cryptoAmount,
      currency_in: this.fiatCurrency,
      currency_out: this.selectedCurrency.value,
      price_in: '1',
      price_out: this.fiatPrice.toString(),
      wallet: await this.walletAddress(),
      provider: this.provider.id.toString(),
      network: this.selectedCurrency.network,
    };
    this.storageOperationService.updateData(data);
  }

  async walletAddress(): Promise<string> {
    return (await this.walletEncryptionService.getEncryptedWallet()).addresses[this.selectedCurrency.network];
  }

  async openModal(event) {
    const modal = await this.modalController.create({
      component: CoinSelectorModalComponent,
      cssClass: 'ux-modal-skip-backup',
    });
    await modal.present();
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
