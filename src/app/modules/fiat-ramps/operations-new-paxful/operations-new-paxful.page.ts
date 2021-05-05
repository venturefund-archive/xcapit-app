import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';

@Component({
  selector: 'app-operations-new-paxful',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/operations-page"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'fiat_ramps.ramp_initial.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <app-ux-input-select
          [label]="'Wallet'"
          [modalTitle]="'Wallet'"
          [placeholder]="'Wallet'"
          controlName="wallet"
          [data]="this.walletAddressSelect"
          [keyName]="'name'"
          [valueName]="'id'"
          *ngIf="this.walletAddressSelect.length > 0"
        ></app-ux-input-select>
      </form>
    </ion-content>
  `,
  styleUrls: ['./operations-new-paxful.page.scss'],
})
export class OperationsNewPaxfulPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    wallet: ['', [Validators.required]],
  });
  walletAddressSelect: string[] = [];

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private fiatRampsService: FiatRampsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    let wallets = [];
    this.fiatRampsService.getUserWallets('BTC').subscribe((apikeys) => {
      apikeys = {
        aliasDeEstasKey: {
          wallets: {
            BTC: '1Ew261FhBSzF4gmnohBS2AtXXe2',
            ETH: '1Ew261FhBSzF4gmnohBS2AtXXe2',
          },
          apikey_id: 148,
        },
        OtroAliasDistinto: {
          wallets: {
            BTC: '1PxN46d8mJDHrE5xwSgKhVyspP',
          },
          apikey_id: 150,
        },
      };

      Object.keys(apikeys).forEach((alias) => {
        const newWallets = Object.keys(apikeys[alias].wallets).map((currency) => {
          return { name: `${alias} (${currency})`, id: apikeys[alias].wallets[currency] };
        });
        wallets = [...wallets, ...newWallets];
      });
      this.walletAddressSelect = Object.values(wallets);
    });
  }

  handleSubmit() {}
}
