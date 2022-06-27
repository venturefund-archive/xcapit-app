import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { PROVIDERS } from '../shared-ramps/constants/providers';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { FiatRampCurrenciesOf } from '../shared-ramps/models/fiat-ramp-currencies-of/fiat-ramp-currencies-of';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { OperationDataInterface, StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';

@Component({
  selector: 'app-directa',
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
            [amountEnabled]="false"
            [amountUSDEnabled]="true"
          ></app-provider-new-operation-card>
        </div>

        <div class="ux_footer">
          <div class="button-next">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Continue"
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
  styleUrls: ['./directa.page.scss'],
})
export class DirectaPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    currency: ['', Validators.required],
  });
  provider: FiatRampProvider;
  providers: FiatRampProvider[] = PROVIDERS;
  providerCurrencies: Coin[];
  selectedCurrency: Coin;
  fiatCurrency: string;
  address: string;
  country: FiatRampProviderCountry;
  operationsList: FiatRampOperation[];
  price: number

  constructor(
    private formBuilder: FormBuilder,
    private browserService: BrowserService,
    private storageOperationService: StorageOperationService,
    private route: ActivatedRoute,
    private walletEncryptionService: WalletEncryptionService,
    private fiatRampsService: FiatRampsService,
    private navController: NavController, 
    private apiWalletService: ApiWalletService,
  ) { }

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('IonViewWillEnter')
    this.provider = this.providers.find((provider) => provider.alias === 'kripton');
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.providerCurrencies = new FiatRampCurrenciesOf(this.provider, this.apiWalletService.getCoins()).value();
    this.setCountry();
    this.setCurrency();
  }

  setCountry() {
    console.log('Empieza setCountry')
    this.country = COUNTRIES.find(
      (country) => country.name.toLowerCase() === this.route.snapshot.paramMap.get('country')
    );
    console.log('Termina setCountry')
  }

  setCurrency() {
    const asset = this.route.snapshot.queryParamMap.get('asset');
    const network = this.route.snapshot.queryParamMap.get('network');
    this.selectedCurrency =
      asset && network
        ? this.providerCurrencies.find((currency) => currency.value === asset && currency.network === network)
        : this.providerCurrencies[0];
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

  openD24(): void {
    throw 'not implemented';
  }

  changeCurrency(): void{
    this.navController.navigateForward(['/fiat-ramps/token-selection', this.provider.alias]);
  }

}
