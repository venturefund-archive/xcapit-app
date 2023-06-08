import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import RoundedNumber from 'src/app/shared/models/rounded-number/rounded-number';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { WarrantyDataService } from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';
import { BuyOrDepositTokenToastComponent } from '../../fiat-ramps/shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { DefaultToken, Token } from '../../swaps/shared-swaps/models/token/token';
import { RawToken } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-send-warranty',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'warranties.send_warranty.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="sw ion-padding">
      <div class="ux_main">
        <form [formGroup]="this.form">
          <div class="sw__send-amount-card ux-card ion-padding no-border">
            <app-asset-detail
              [blockchain]="this.coin.blockchain"
              [token]="this.coin.value"
              [tokenLogo]="this.coin.logoRoute"
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
              [baseCurrency]="this.coin"
              [quotePrice]="this.quotePrice"
              [showRange]="false"
              [disclaimer]="false"
              [max]="this.balance"
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
          [disabled]="!this.form.valid && !this.isLoading"
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
  coin = {
    value: 'USDC',
    blockchain: 'MATIC',
    logoRoute: 'assets/img/coins/USDC-POLYGON.svg',
  };
  token: Coin;
  balance: number;
  quotePrice: number;
  isLoading = false;
  private readonly priceRefreshInterval = 15000;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private walletService: WalletService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private WarrantyDataService: WarrantyDataService,
    private dynamicPriceFactory: DynamicPriceFactory,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  async ionViewWillEnter() {
    this.setToken();
    await this.walletService.walletExist();
    this.dynamicPrice();
    await this.tokenBalance();
    this.checkBalance();
  }

  private async userWallet(): Promise<string> {
    return await this.storageService.getWalletsAddresses(this.coin.blockchain);
  }

  private dynamicPrice() {
    this.dynamicPriceFactory
      .new(this.priceRefreshInterval, this.coin, this.apiWalletService)
      .value()
      .pipe(takeUntil(this.leave$))
      .subscribe((price: number) => {
        this.quotePrice = price;
      });
  }

  async tokenBalance() {
    const tokenBalance = parseFloat(
      await this.walletService.balanceOf(await this.userWallet(), this.coin.value, this.coin.blockchain)
    );
    this.balance = tokenBalance;
    this.addLowerThanValidator();
  }

  checkBalance() {
    this.form.get('amount').valueChanges.subscribe((value) => {
      if (this.balance < Number(value)) {
        this.openBalanceModal();
      }
    });
    this.form.get('quoteAmount').valueChanges.subscribe((value) => {
      if (this.balance * this.quotePrice < Number(value)) {
        this.openBalanceModal();
      }
    });
  }

  private addLowerThanValidator() {
    this.form.get('amount').addValidators(CustomValidators.lowerThanEqual(this.balance));
    this.form.get('amount').updateValueAndValidity();
  }

  private saveWarrantyData() {
    const roundedAmount = new RoundedNumber(parseFloat(this.form.value.amount), 6).value();
    const roundedQuoteAmount = new RoundedNumber(parseFloat(this.form.value.quoteAmount), 6).value();
    this.WarrantyDataService.data = {
      coin: this.token,
      amount: roundedAmount,
      quoteAmount: roundedQuoteAmount,
      user_dni: this.form.value.dni,
    };
  }

  goToSummary() {
    this.navController.navigateForward(['warranties/warranty-summary']);
  }

  submitForm() {
    this.isLoading = true;
    if (this.form.valid) {
      this.saveWarrantyData();
      this.goToSummary();
    }
    this.isLoading = false;
  }

  setToken() {
    this.token = this.apiWalletService
      .getCoins()
      .find((coin: Coin) => coin.value === this.coin.value && coin.network === this.coin.blockchain);
  }

  // async openBalanceModal() {
  //   const token: Token = new DefaultToken(this.token as RawToken);
  //   const modal = await this.modalController.create({
  //     component: BuyOrDepositTokenToastComponent,
  //     cssClass: 'ux-toast-warning-with-margin',
  //     showBackdrop: false,
  //     id: 'feeModal',
  //     componentProps: {
  //       text: this.translate.instant('warranties.insufficient_balance.text', { token: token.symbol() }),
  //       primaryButtonText: this.translate.instant('warranties.insufficient_balance.buy_button', {
  //         token: token.symbol(),
  //       }),
  //       secondaryButtonText: this.translate.instant('warranties.insufficient_balance.deposit_button', {
  //         token: token.symbol(),
  //       }),
  //       token,
  //     },
  //   });
  //   await modal.present();
  //   await modal.onDidDismiss();
  // }

  async openBalanceModal() {
    const token: Token = new DefaultToken(this.token as RawToken);
    new BalanceModal()
    const modal = await this.modalController.create({
      component: BuyOrDepositTokenToastComponent,
      cssClass: 'ux-toast-warning-with-margin',
      showBackdrop: false,
      id: 'feeModal',
      componentProps: {
        text: this.translate.instant('warranties.insufficient_balance.text', { token: token.symbol() }),
        primaryButtonText: this.translate.instant('warranties.insufficient_balance.buy_button', {
          token: token.symbol(),
        }),
        secondaryButtonText: this.translate.instant('warranties.insufficient_balance.deposit_button', {
          token: token.symbol(),
        }),
        token,
      },
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }
}
