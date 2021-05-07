import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';

const { Browser } = Plugins;

@Component({
  selector: 'app-operations-new-paxful',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/operations"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'fiat_ramps.paxful.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <div>
            <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">
              {{ 'fiat_ramps.paxful.title' | translate }}
            </ion-text>
          </div>
          <div>
            <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-14">
              {{ 'fiat_ramps.paxful.text' | translate }}
            </ion-text>
          </div>
          <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
            <div class="loader" *ngIf="!this.walletAddressSelect">
              <app-ux-loading-block minSize="30px"></app-ux-loading-block>
            </div>
            <app-ux-input-select
              [label]="'fiat_ramps.paxful.label-wallet' | translate"
              [modalTitle]="'Wallet'"
              [placeholder]="'Wallet'"
              controlName="wallet"
              [data]="this.walletAddressSelect"
              [keyName]="'name'"
              [valueName]="'address'"
              *ngIf="this.walletAddressSelect"
            ></app-ux-input-select>
            <div class="button-next">
              <ion-button
                appTrackClick
                name="Next"
                class="ux_button"
                type="submit"
                color="uxsecondary"
                size="large"
                [disabled]="this.submitButtonService.isDisabled | async"
              >
                {{ 'fiat_ramps.paxful.button-text' | translate }}
              </ion-button>
            </div>
          </form>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./operations-new-paxful.page.scss'],
})
export class OperationsNewPaxfulPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    wallet: ['', [Validators.required]],
  });
  walletAddressSelect: any[];
  isPWA = false;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private platformService: PlatformService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.checkIsWebPlatform();

    this.fiatRampsService.provider = 'paxful';

    let wallets = [];

    this.fiatRampsService.getUserWallets('BTC').subscribe((apikeys) => {
      Object.keys(apikeys).forEach((alias) => {
        const newWallets = Object.keys(apikeys[alias].wallets).map((currency) => {
          return {
            name: `${alias} (${currency})`,
            apikey_id: apikeys[alias].apikey_id,
            address: apikeys[alias].wallets[currency],
          };
        });
        wallets = [...wallets, ...newWallets];
      });
      this.walletAddressSelect = Object.values(wallets);
    });

    if (this.walletAddressSelect.length === 0) {
      this.goToCreateApikey();
    }
  }

  ionViewWillLeave() {
    this.fiatRampsService.provider = '1';
  }

  goToCreateApikey() {
    this.navController.navigateBack(['/apikeys/list']);
  }

  checkIsWebPlatform() {
    this.isPWA = this.platformService.isWeb();
  }

  async handleSubmit() {
    if (this.form.valid) {
      const data = this.walletAddressSelect.find((wallet) => {
        return wallet.address === this.form.value.wallet;
      });
      this.form.reset();
      this.openPaxfulLink(data.apikey_id);
    } else {
      this.form.markAllAsTouched();
    }
  }

  async openPaxfulLink(apikeyId: number) {
    this.fiatRampsService.getLink(apikeyId).subscribe(async (response) => {
      if (this.isPWA) {
        await Browser.open(response);
        this.success();
      } else {
        const browserClosed = Browser.addListener('browserFinished', () => {
          this.success();
          browserClosed.remove();
        });

        Browser.open(response);
      }
    });
  }

  success() {
    this.navController.navigateForward(['/fiat-ramps/new-operation/success-paxful']);
  }
}
