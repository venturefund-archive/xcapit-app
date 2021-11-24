import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';

const { Browser } = Plugins;

@Component({
  selector: 'app-operations-new-paxful',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/select-provider"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.paxful.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form class="ux_main" [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <div class="ux_content">
          <div>
            <ion-text class="ux-font-text-xl">
              {{ 'fiat_ramps.paxful.title' | translate }}
            </ion-text>
          </div>
          <div class="info_text">
            <ion-text class="ux-font-text-xs">
              {{ 'fiat_ramps.paxful.text' | translate }}
            </ion-text>
          </div>
          <div class="loader" *ngIf="!this.walletAddressSelect">
            <app-ux-loading-block minSize="30px"></app-ux-loading-block>
          </div>
          <app-ux-input-select
            [label]="'fiat_ramps.paxful.label-wallet' | translate"
            [modalTitle]="'fiat_ramps.paxful.modal_title' | translate"
            [placeholder]="'fiat_ramps.paxful.placeholder-wallet' | translate"
            controlName="wallet"
            [data]="this.walletAddressSelect"
            [keyName]="'name'"
            [valueName]="'address'"
            *ngIf="this.walletAddressSelect"
          ></app-ux-input-select>
          <div class="recordatory">
            <app-paxful-recordatory-card></app-paxful-recordatory-card>
          </div>
        </div>
        <div class="ux_footer">
          <div class="need-help">
            <ion-button
              class="ux-link-xs underline"
              name="Help-paxful"
              (click)="this.openInfo()"
              appTrackClick
              fill="clear"
              size="small"
              >{{ 'shared.need_help.text_help_link' | translate }}</ion-button
            >
          </div>
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
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./operations-new-paxful.page.scss'],
})
export class OperationsNewPaxfulPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    wallet: ['', [Validators.required]],
  });
  walletAddressSelect: any[];
  browser = Browser;
  links = LINKS;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
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

      if (this.walletAddressSelect.length === 0) {
        this.goToCreateApikey();
      }
    });
  }

  goToCreateApikey() {
    this.navController.navigateBack(['/apikeys/list']);
  }

  async openInfo() {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: this.links.infoPaxful,
    });
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
      this.success().then(() => {
        this.browser.open(response);
      });
    });
  }

  success(): Promise<boolean> {
    return this.navController.navigateForward(['/fiat-ramps/new-operation/success-paxful']);
  }
}
