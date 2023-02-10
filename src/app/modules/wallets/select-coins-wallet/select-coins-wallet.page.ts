import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { WalletMaintenanceService } from '../shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { debounce } from 'rxjs/operators';
import { interval } from 'rxjs';
import { TrackService } from 'src/app/shared/services/track/track.service';
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
          <div class="sc__search-bar">
            <app-search-bar (search)="this.handleChange($event)" appTrackClick></app-search-bar>
          </div>
          <div class="sc__empty-state" *ngIf="this.coins.length === 0">
            <div>
              <img src="assets/img/wallets/no-results.svg" />
            </div>
            <div>
              <ion-text class="ux-font-text-xxs" color="neutral80"> {{ 'wallets.select_coin.no_result_search' | translate }}</ion-text>
            </div>
          </div>
          <ion-item lines="none" class="sc__toggle_all ux-font-title-xs ion-no-padding" *ngIf="!this.disableSelectAll">
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
            *ngFor="let network of this.networks"
            [network]="network"
            [coins]="this.getCoinsFromNetwork(network)"
            [natives]="this.natives"
          ></app-items-coin-group>
          <div class="sc__require-token">
            <app-require-token buttonEventName="ux_exp_addtoken_select"></app-require-token>
          </div>
        </div>
      </form>
    </ion-content>`,
  styleUrls: ['./select-coins-wallet.page.scss'],
})
export class SelectCoinsWalletPage {
  userCoinsLoaded: boolean;
  form: UntypedFormGroup;
  allSelected = false;
  networks: string[];
  coins: Coin[] = [];
  natives: Coin[] = [];
  disableSelectAll: boolean;
  eventEmitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiWalletService: ApiWalletService,
    private walletMaintenanceService: WalletMaintenanceService,
    private trackService: TrackService
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

  private setNetworks(): void {
    this.networks = this.apiWalletService.getNetworks();
  }

  createForm() {
    this.getCoins();
    if (!this.form) {
      const formGroup = {};

      this.networks.forEach((network) => {
        formGroup[network] = this.createSuiteFormGroup(this.getCoinsFromNetwork(network));
      });

      this.form = this.formBuilder.group(formGroup);
    }
  }

  getCoins() {
    this.networks.forEach((network) => {
      this.coins = this.coins.concat(this.apiWalletService.getCoinsFromNetwork(network));
    });
    this.natives = this.coins.filter((coin) => coin.native === true);
    return this.coins;
  }

  async updateTokens() {
    this.setAllSelected();
    const userCoins = [];
    Object.entries(this.form.value).forEach((network) => {
      Object.entries(network[1]).forEach((coin) => {
        if (coin[1]) userCoins.push({ value: coin[0], network: network[0] });
      });
    });
    await this.walletMaintenanceService.updateTokensStorage(userCoins);
  }

  getCoinsFromNetwork(network: string) {
    return this.coins.filter((coin) => coin.network === network);
  }

  handleChange(event) {
    if (!this.eventEmitted) {
      this.eventEmitted = true;
      this.setEventToSearch();
    }
    this.disableSelectAll = true;
    const search = event.target.value.toLowerCase();
    if (search) {
      this.coins = this.coins.filter((coin) => {
        return coin.value.toLowerCase().indexOf(search) > -1;
      });
      if (this.coins.length === 0) {
        this.setEventToEmptySearch();
      }
    } else if (search === '') {
      this.reloadCoins();
    }
  }

  reloadCoins() {
    this.coins = [];
    this.coins = this.getCoins();
    this.disableSelectAll = false;
  }

  setEventToSearch() {
    this.trackService.trackEvent({
      eventLabel: 'ux_edit_tokens_search',
    });
  }

  setEventToEmptySearch() {
    this.trackService.trackEvent({
      eventLabel: 'ux_edit_tokens_search_empty',
    });
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
