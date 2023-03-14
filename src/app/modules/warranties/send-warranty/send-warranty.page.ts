import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { SendWarrantyDataService } from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';

@Component({
  selector: 'app-send-warranty',
  template: ` <ion-header>
      <div></div>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded ux_toolbar__left no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'warranties.send_warranty.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="sw ion-padding">
      <form [formGroup]="this.form">
        <div class="sw__send-amount-card ux-card ion-padding no-border">
          <app-asset-detail
            [blockchain]="this.token.network"
            [token]="this.token.value"
            [tokenLogo]="this.token.logoRoute"
          ></app-asset-detail>
          <div class="content__input">
            <app-ux-input
              type="number"
              controlName="dni"
              inputmode="number"
              [labelColor]="'primary'"
              [label]="'warranties.send_warranty.text_dni' | translate"
              [placeholder]="'DNI'"
            ></app-ux-input>
          </div>
        </div>
        <div class="sw__send-amount-card ux-card no-border">
          <app-amount-input-card
            *ngIf="this.balance !== undefined"
            [label]="'warranties.send_warranty.deposit_amount' | translate"
            [header]="'defi_investments.shared.amount_input_card.available' | translate"
            [baseCurrency]="this.token"
            [quotePrice]="this.quotePrice"
            [showRange]="false"
            [disclaimer]="false"
            [max]="this.balance"
            [feeToken]="this.token"
          ></app-amount-input-card>
          <app-amount-input-card-skeleton
            *ngIf="this.balance === undefined"
            [showRange]="false"
          ></app-amount-input-card-skeleton>
        </div>
      </form>
      <div class="sw__support">
        <app-whatsapp-support> </app-whatsapp-support>
      </div>
    </ion-content>
    <ion-footer class="sw__footer">
      <div class="sw__footer__submit-button ion-padding">
        <ion-button
          class="ux_button sw__footer__submit-button__button"
          appTrackClick
          name="ux_warranty_start_amount"
          color="secondary"
          expand="block"
          (click)="this.submitForm()"
          [disabled]="!this.form.valid"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-footer>`,
  styleUrls: ['./send-warranty.page.scss'],
})
export class SendWarrantyPage {
  form: UntypedFormGroup = this.formBuilder.group({
    amount: [0, [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(9), Validators.pattern('[0-9]*$')]],
  });
  modalHref: string;
  leave$ = new Subject<void>();
  token = {
    value: 'USDC',
    network: 'MATIC',
    logoRoute: 'assets/img/coins/USDC-POLYGON.svg',
    native: false,
  };
  balance: number;
  quotePrice: number;
  private readonly priceRefreshInterval = 15000;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private walletService: WalletService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private sendWarrantyDataService: SendWarrantyDataService,
    private dynamicPriceFactory: DynamicPriceFactory,
    private trackService: TrackService
  ) {}

  async ionViewWillEnter() {
    await this.walletService.walletExist();
    this.dynamicPrice();
    await this.tokenBalance();
  }

  private async userWallet(): Promise<string> {
    return await this.storageService.getWalletsAddresses(this.token.network);
  }

  private dynamicPrice() {
    this.dynamicPriceFactory
      .new(this.priceRefreshInterval, this.token, this.apiWalletService)
      .value()
      .pipe(takeUntil(this.leave$))
      .subscribe((price: number) => {
        this.quotePrice = price;
      });
  }

  setEvent() {
    this.trackService.trackEvent({
      eventLabel: 'ux_warranty_start_amount',
    });
  }

  async tokenBalance() {
    const tokenBalance = parseFloat(
      await this.walletService.balanceOf(await this.userWallet(), this.token.value, this.token.network)
    );
    this.balance = tokenBalance;
    this.addLowerThanValidator();
  }
  private addLowerThanValidator() {
    this.form.get('amount').addValidators(CustomValidators.lowerThanEqual(this.balance));
    this.form.get('amount').updateValueAndValidity();
  }

  private saveWarrantyData() {
    this.sendWarrantyDataService.data = {
      blockchain: this.token.network,
      token: this.token.value,
      amount: parseFloat(this.form.value.amount),
      quoteAmount: this.form.value.quoteAmount,
      dni: this.form.value.dni,
    };
  }

  goToSummary() {
    this.navController.navigateForward(['']);
  }

  submitForm() {
    if (this.form.valid) {
      this.saveWarrantyData();
      this.setEvent();
      this.goToSummary();
    }
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }
}
