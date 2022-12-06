import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { WalletMaintenanceService } from '../shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { debounce } from 'rxjs/operators';
import { interval } from 'rxjs';
@Component({
  selector: 'app-select-coins-wallet',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.select_coin.header_edit' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding sc">
      <form [formGroup]="this.form" class="ux_main" *ngIf="!!this.form && this.userCoinsLoaded">
        <div class="sc__content ux_content">
          <app-ux-title class="ion-padding-top ion-margin-top ">
            <div class="sc__title ux-font-text-lg ion-margin-top">
              {{ 'wallets.select_coin.title' | translate }}
            </div>
          </app-ux-title>
          <app-ux-text class="ion-padding-top ion-margin-top">
            <div class="sc__subtitle ux-font-text-base">
              {{ 'wallets.select_coin.subtitle' | translate }}
            </div>
          </app-ux-text>
          <ion-item lines="none" class="sc__toggle_all ux-font-title-xs ion-no-padding">
            <ion-label class="sc__toggle_all__label ion-no-margin ion-no-padding">
              {{ 'wallets.select_coin.toggle_all_text' | translate }}
            </ion-label>
            <ion-toggle
              name="ux_create_all"
              class="sc__toggle_all__toggle ux-toggle ion-no-padding"
              [checked]="this.allSelected"
              (click)="this.toggleAll($event)"
              mode="ios"
              slot="end"
            ></ion-toggle>
          </ion-item>
          <app-items-coin-group
            [network]="network"
            [coins]="this.getCoinsFromNetwork(network)"
            *ngFor="let network of this.networks"
          ></app-items-coin-group>
        </div>
      </form>
    </ion-content>`,
  styleUrls: ['./select-coins-wallet.page.scss'],
})
export class SelectCoinsWalletPage implements OnInit {
  userCoinsLoaded: boolean;
  form: UntypedFormGroup;
  allSelected = false;
  networks: string[];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiWalletService: ApiWalletService,
    private walletMaintenanceService: WalletMaintenanceService
  ) {}

  ionViewWillEnter() {
    this.userCoinsLoaded = false;
    this.setNetworks();
    this.createForm();
    this.getUserCoins();
  }

  ionViewDidLeave() {
    this.walletMaintenanceService.wipeDataFromService();
  }

  ngOnInit() {}

  private setNetworks(): void {
    this.networks = this.apiWalletService.getNetworks();
  }

  createForm() {
    if (!this.form) {
      const formGroup = {};

      this.networks.forEach((network) => {
        formGroup[network] = this.createSuiteFormGroup(this.getCoinsFromNetwork(network));
      });

      this.form = this.formBuilder.group(formGroup);
    }
  }

  async updateTokens() {
    this.setAllSelected();
    const userCoins = [];
    Object.entries(this.form.value).forEach((network) => {
      Object.entries(network[1]).forEach((coin) => {
        if (coin[1])
          userCoins.push({ value: coin[0], network: network[0] });
      })
    })
    await this.walletMaintenanceService.updateTokensStorage(userCoins);
  }

  getCoinsFromNetwork(network: string) {
    return this.apiWalletService.getCoinsFromNetwork(network);
  }

  createSuiteFormGroup(suite: Coin[]): UntypedFormGroup {
    const formGroup = {};
    suite.forEach((c) => {
      formGroup[c.value] = [false];
    });

    return this.formBuilder.group(formGroup);
  }

  private getSuiteFormGroupKeys(): string[] {
    return Object.keys(this.form.value);
  }

  private getCoinFormGroupKeys(network: string): string[] {
    return Object.keys(this.form.value[network]);
  }

  async getUserCoins() {
    const formData = {};
    const coins = await this.walletMaintenanceService.getUserAssets();
    coins.forEach((coin) => {
      if (!formData[coin.network]) formData[coin.network] = {};
      formData[coin.network][coin.value] = true;
    });

    this.form.patchValue(formData);
    this.userCoinsLoaded = true;
    this.setAllSelected();
    this.form.valueChanges.pipe(debounce(() => interval(100))).subscribe(() => this.updateTokens());
  }

  toggleAll(event: any) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    const setAll = !this.allSelected;
    const formData = {};

    this.getSuiteFormGroupKeys().forEach((network) => {
      formData[network] = {};
      this.getCoinFormGroupKeys(network).forEach((coin) => {
        formData[network][coin] = setAll;
      });
    });

    this.form.patchValue(formData);
  }

  setAllSelected() {
    const networkToggledStates = [];

    this.getSuiteFormGroupKeys().forEach((network) => {
      networkToggledStates.push(Object.values(this.form.value[network]).every(Boolean));
    });

    this.allSelected = Object.values(networkToggledStates).every(Boolean);
  }
}
