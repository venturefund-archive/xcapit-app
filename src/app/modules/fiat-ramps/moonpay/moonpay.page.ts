import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { ActivatedRoute } from '@angular/router';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { LINKS } from 'src/app/config/static-links';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { PROVIDERS } from '../shared-ramps/constants/providers';

@Component({
  selector: 'app-moonpay',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'fiat_ramps.moonpay.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-start ion-padding-end">
    <form [formGroup]="this.form"> 
    <app-provider-new-operation-card
            *ngIf="this.form.value.currency"
            [amountEnabled]="false"
            [coin]="this.form.value.currency"
            [provider]="this.provider"
            (changeCurrency)="this.changeCurrency()"
    ></app-provider-new-operation-card>
    </form>
        <ion-button
          appTrackClick
          name="ux_buy_moonpay_continue"
          expand="block"
          size="large"
          type="submit"
          class="ux_button"
          color="secondary"
          (click)="this.openMoonpay()"
        >
          {{ 'fiat_ramps.moonpay.button_text' | translate }}
        </ion-button>
    </ion-content>
    
  `,
  styleUrls: ['./moonpay.page.scss'],
})
export class MoonpayPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    currency: ['', Validators.required],
  });
  coins: Coin[];
  address: string;
  operationsList: FiatRampOperation[];
  provider: FiatRampProvider;
  providers: FiatRampProvider[] = PROVIDERS;

  constructor(
    private formBuilder: FormBuilder,
    private browserService: BrowserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private walletEncryptionService: WalletEncryptionService,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.provider = this.providers.find((provider) => provider.alias === 'moonpay');
    this.subscribeToFormChanges();
    this.initAssetsForm();
  }

  initAssetsForm() {
    const token = this.route.snapshot.queryParamMap.get('asset');
    const network = this.route.snapshot.queryParamMap.get ('network');
    this.storageService.getAssestsSelected().then((coins) => {
      this.coins = coins.filter((coin) => Boolean(coin.moonpayCode));
      if (token&&network) {
        this.form.patchValue({ currency: this.coins.find((coin) => coin.value === token && coin.network === network) });
      } else {
        this.form.patchValue({ currency: this.coins[0] });
      }
    });
  }

  subscribeToFormChanges() {
    this.form.get('currency').valueChanges.subscribe((value) => {
      this.getAddress(value);
    });
  }

  getAddress(currency: Coin) {
    this.walletEncryptionService.getEncryptedWallet().then((wallet) => {
      const network = this.coins.find((coin) => coin.value === currency.value).network;
      this.address = wallet.addresses[network];
    });
  }

  async openMoonpay() {
    this.fiatRampsService
      .getMoonpayLink(this.address, this.form.value.currency.moonpayCode)
      .toPromise()
      .then(async (link) => {
        this.success().then(() => {
          this.browserService.open(link);
        });
      });
  }

  success(): Promise<boolean> {
    return this.navController.navigateForward(['/tabs/wallets']);
  }  

  changeCurrency(): void{
    this.navController.navigateForward(['/fiat-ramps/token-selection', this.provider.alias]);
  }
}
