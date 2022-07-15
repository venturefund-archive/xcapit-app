import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import {
  OperationDataInterface,
  StorageOperationService,
} from '../shared-ramps/services/operation/storage-operation.service';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { BrowserService } from '../../../shared/services/browser/browser.service';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { KriptonDynamicPrice } from '../shared-ramps/models/kripton-dynamic-price/kripton-dynamic-price';
import { KriptonDynamicPriceFactory } from '../shared-ramps/models/kripton-dynamic-price/factory/kripton-dynamic-price-factory';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { ProviderDataRepo } from '../shared-ramps/models/provider-data-repo/provider-data-repo';
import { ProviderTokensOf } from '../shared-ramps/models/provider-tokens-of/provider-tokens-of';
@Component({
  selector: 'app-operations-new',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/select-provider"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.new_operation.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content aon">
          <app-provider-new-operation-card
            *ngIf="this.selectedCurrency && this.fiatCurrency"
            [coin]="this.selectedCurrency"
            [fiatCurrency]="this.fiatCurrency"
            [provider]="this.provider"
            (changeCurrency)="this.changeCurrency()"
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

        <div class="ux_footer">
          <div class="button-next">
            <ion-button
              class="ux_button"
              appTrackClick
              name="ux_buy_kripton_continue"
              type="submit"
              color="secondary"
              size="large"
              [disabled]="!this.form.valid"
            >
              {{ 'fiat_ramps.new_operation.next_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
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
  price: number;
  priceRefreshInterval = 15000;
  private destroy$ = new Subject<void>();

  form: FormGroup = this.formBuilder.group({
    cryptoAmount: ['', [Validators.required]],
    fiatAmount: ['', [Validators.required]],
    thirdPartyKYC: [false, [Validators.required]],
    thirdPartyTransaction: [false, [Validators.required]],
    acceptTOSAndPrivacyPolicy: [false, [Validators.required]],
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private storageOperationService: StorageOperationService,
    private walletEncryptionService: WalletEncryptionService,
    private apiWalletService: ApiWalletService,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private browserService: BrowserService,
    private http: HttpClient,
    private kriptonDynamicPrice: KriptonDynamicPriceFactory,
    private providers: ProvidersFactory
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
    this.provider = this.getProviders().byAlias('kripton');
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.availableCoins();
    this.setCountry();
    this.setCurrency();
    this.dynamicPrice();
    this.subscribeToFormChanges();
  }

  availableCoins() {
    this.providerTokens = new ProviderTokensOf(this.getProviders(), this.apiWalletService.getCoins()).byAlias(
      'kripton'
    );
  }

  getProviders() {
    return this.providers.create(this.http);
  }

  subscribeToFormChanges() {
    this.form.get('cryptoAmount').valueChanges.subscribe((value) => this.cryptoAmountChange(value));
    this.form.get('fiatAmount').valueChanges.subscribe((value) => this.fiatAmountChange(value));
  }

  private cryptoAmountChange(value: number) {
    this.form.patchValue({ fiatAmount: value * this.price }, { emitEvent: false, onlySelf: true });
  }

  private fiatAmountChange(value: number) {
    this.form.patchValue({ cryptoAmount: value / this.price }, { emitEvent: false, onlySelf: true });
  }

  private dynamicPrice() {
    this.createKriptonDynamicPrice()
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => (this.price = price));
  }

  createKriptonDynamicPrice(): KriptonDynamicPrice {
    return this.kriptonDynamicPrice.new(this.priceRefreshInterval, this.fiatCurrency, this.selectedCurrency, this.http);
  }

  setCountry() {
    this.country = COUNTRIES.find(
      (country) => country.isoCodeAlpha3 === this.route.snapshot.queryParamMap.get('country')
    );
  }

  async setCurrency() {
    const asset = this.route.snapshot.queryParamMap.get('asset');
    const network = this.route.snapshot.queryParamMap.get('network');
    this.selectedCurrency =
      asset && network
        ? this.providerTokens.find((currency) => currency.value === asset && currency.network === network)
        : this.providerTokens[0];
    this.fiatCurrency = this.country.fiatCode ? this.country.fiatCode : 'USD';
  }

  async handleSubmit() {
    if (this.form.valid) {
      await this.setOperationStorage();
      this.checkUser();
    } else {
      this.form.markAllAsTouched();
    }
  }

  async checkUser() {
    const checkUserResponse = await this.fiatRampsService.checkUser().toPromise();
    const userStatus = checkUserResponse.id ? checkUserResponse : await this.fiatRampsService.createUser().toPromise();
    this.redirectByStatus(userStatus);
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
      price_out: this.price.toString(),
      wallet: await this.walletAddress(),
      provider: this.provider.id.toString(),
      network: this.selectedCurrency.network,
    };
    this.storageOperationService.updateData(data);
  }

  async walletAddress(): Promise<string> {
    return (await this.walletEncryptionService.getEncryptedWallet()).addresses[this.selectedCurrency.network];
  }

  getUrlByStatus(statusName) {
    let url: string[];
    switch (statusName) {
      case RegistrationStatus.USER_INFORMATION: {
        url = ['fiat-ramps/user-information'];
        break;
      }
      case RegistrationStatus.USER_BANK: {
        url = ['fiat-ramps/user-bank'];
        break;
      }
      case RegistrationStatus.USER_IMAGES: {
        url = ['fiat-ramps/user-images'];
        break;
      }
      case RegistrationStatus.COMPLETE: {
        url = ['fiat-ramps/confirm-page'];
        break;
      }
    }
    return url;
  }

  redirectByStatus(userStatus) {
    const url = this.getUrlByStatus(userStatus.registration_status);
    this.navController.navigateForward(url);
  }

  changeCurrency(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        country: this.country.isoCodeAlpha3,
      },
    };

    this.navController.navigateForward(['/fiat-ramps/token-selection', this.provider.alias], navigationExtras);
  }
}
