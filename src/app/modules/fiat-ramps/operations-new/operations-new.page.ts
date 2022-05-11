import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { Countries } from '../enums/countries.enum';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { PROVIDERS } from '../shared-ramps/constants/providers';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ActivatedRoute } from '@angular/router';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { BrowserService } from '../../../shared/services/browser/browser.service';
import { KriptonCurrencies } from '../shared-ramps/models/kripton-currencies';

@Component({
  selector: 'app-operations-new',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/new-operation/moonpay"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.new_operation.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <app-provider-new-operation-card
            *ngIf="this.selectedCurrency"
            [coin]="this.selectedCurrency"
            [provider]="this.provider"
            (changeCurrency)="this.changeCurrency()"
          ></app-provider-new-operation-card>

          <div>
            <div class="term-item ion-no-padding ion-no-margin">
              <ion-checkbox formControlName="thirdPartyKYC" mode="md" slot="start"></ion-checkbox>
              <ion-label class="ion-no-padding ion-no-margin">
                <ion-text class="ux-font-text-xxs" color="neutral80">
                  {{ 'fiat_ramps.new_operation.thirdPartyKYC' | translate }}
                </ion-text>
              </ion-label>
            </div>

            <div class="term-item ion-no-padding ion-no-margin">
              <ion-checkbox formControlName="thirdPartyTransaction" mode="md" slot="start"></ion-checkbox>
              <ion-label class="ion-no-padding ion-no-margin checkbox-link">
                <ion-text class="ux-font-text-xxs" color="neutral80">
                  {{ 'fiat_ramps.new_operation.thirdPartyTransaction' | translate }}
                </ion-text>
              </ion-label>
            </div>

            <div class="term-item ion-no-padding ion-no-margin">
              <ion-checkbox formControlName="acceptTOSAndPrivacyPolicy" mode="md" slot="start"></ion-checkbox>
              <ion-label
                class="ion-no-padding ion-no-margin ux-font-text-xxs"
                color="neutral80"
                [innerHTML]="'fiat_ramps.new_operation.privacyPolicyAndTOS' | translate"
              >
              </ion-label>
            </div>
          </div>
        </div>

        <div class="ux_footer">
          <div class="button-next">
            <ion-button class="ux_button" appTrackClick name="Next" type="submit" color="secondary" size="large">
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
  provider = PROVIDERS.find((provider) => provider.id === 1);
  providerCurrencies: Coin[];
  selectedCurrency: Coin;
  country: any;

  form: FormGroup = this.formBuilder.group({
    currency_in: [null, [Validators.required]], //TT: Tiene que tener la del pais seleccionado
    currency_out: [null, [Validators.required]], //TT: La actual
    amount: ['', [Validators.required]], //TT: Rangos cantidad para comprar
    quoteAmount: ['', [Validators.required]],
    thirdPartyKYC: [false, [Validators.required]],
    thirdPartyTransaction: [false, [Validators.required]],
    acceptTOSAndPrivacyPolicy: [false, [Validators.required]],
    provider: [this.provider.id.toString()],
    //TT: Hace falta ensuciar la view con el campo ahora o lo agrego luego con un objeto?
    // type: ['cash-in', [Validators.required]],
    // pair: ['', [Validators.required]],
    // country: ['Argentina', [Validators.maxLength(150)]],
  });

  quotations: any = null;
  changePrice = null;
  pairSplit = [];
  amountOut = null;

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
    private browserService: BrowserService
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
    this.providerCurrencies = KriptonCurrencies.create(this.apiWalletService.getCoins()).value();
    this.setCurrency();
    this.setCountry();
    this.fiatRampsService.setProvider(this.provider.id.toString());
  }

  setCurrency() {
    const asset = this.route.snapshot.queryParamMap.get('asset');
    const network = this.route.snapshot.queryParamMap.get('network');
    this.selectedCurrency =
      asset && network
        ? this.providerCurrencies.find((currency) => currency.value === asset && currency.network === network)
        : this.providerCurrencies[0];
  }

  setCountry() {
    this.country = this.route.snapshot.paramMap.get('country');
    console.log(this.country);
  }

  handleSubmit() {
    if (this.form.valid) {
      this.setOperationStorage();
      this.checkUser();
    } else {
      this.form.markAllAsTouched();
    }
  }

  async getQuotations() {
    this.changePrice = '';
    this.form.controls.wallet.setValue('');
    this.form.controls.network.setValue('');
    this.form.controls.amount_in.setValue('');
    this.fiatRampsService.getQuotations().subscribe((res) => {
      this.quotations = res.data;
      this.getPrice();
    });
  }

  async checkUser() {
    this.fiatRampsService.checkUser().subscribe((res) => {
      if (!res.id) {
        this.createUser();
      } else {
        this.redirectByStatus(res);
      }
    });
  }

  async getPrice() {
    this.pairSplit = this.form.value.pair.split('_');
    this.form.controls.currency_in.setValue(this.pairSplit[0]);
    this.form.controls.currency_out.setValue(this.pairSplit[1]);
    this.pairSplit = this.form.value.type === 'cash-out' ? this.pairSplit.reverse() : this.pairSplit;
    const price = this.quotations.filter((pair) => pair.currency === this.pairSplit[1].toLowerCase());
    const coin = this.apiWalletService.getCoins().find((coin) => coin.value === this.pairSplit[1]);

    if (price[0]) {
      if (this.form.value.type === 'cash-in') {
        this.changePrice = price[0].quotations[this.pairSplit[0].toLowerCase()].sell;
        this.form.controls.price_in.setValue(1);
        this.form.controls.price_out.setValue(this.changePrice);
      } else {
        this.changePrice = price[0].quotations[this.pairSplit[0].toLowerCase()].buy;
        this.form.controls.price_in.setValue(1);
        this.form.controls.price_out.setValue(this.changePrice);
      }
    }
    this.form.patchValue({ wallet: await this.userWalletFor(coin.network) });
    this.form.patchValue({ network: coin.network });
  }

  async createUser() {
    this.fiatRampsService.createUser().subscribe({
      next: (res) => {
        this.redirectByStatus(res);
      },
    });
  }

  setOperationStorage() {
    const data = this.form.value;
    this.storageOperationService.updateData(data);
  }

  setOutAmount() {
    this.amountOut = this.form.value.amount_in / this.changePrice;
    this.form.controls.amount_out.setValue(this.amountOut);
  }

  async userWalletFor(network: string): Promise<string> {
    return (await this.walletEncryptionService.getEncryptedWallet()).addresses[network];
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
    this.navController.navigateForward(['/fiat-ramps/token-selection', this.provider.alias]);
  }
}
