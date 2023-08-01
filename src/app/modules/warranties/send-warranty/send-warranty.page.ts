import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import RoundedNumber from 'src/app/shared/models/rounded-number/rounded-number';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { WarrantyDataService } from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';
import { Token } from '../../swaps/shared-swaps/models/token/token';
import { RawToken, TokenRepo } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { ModalFactoryInjectable } from 'src/app/shared/models/modal/injectable/modal-factory.injectable';
import { Modals } from '../../../shared/models/modal/factory/default/default-modal-factory';
import { ActiveLenderInjectable } from '../../../shared/models/active-lender/injectable/active-lender.injectable';
import { TokenByAddress } from '../../swaps/shared-swaps/models/token-by-address/token-by-address';
import { BlockchainTokens } from '../../swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { DefaultTokens } from '../../swaps/shared-swaps/models/tokens/tokens';
import { Lender } from 'src/app/shared/models/lender/lender.interface';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';

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
          <div class="sw__send-amount-card ux-card ion-padding no-border" *ngIf="this.tplToken">
            <app-asset-detail
              [blockchain]="this.tplToken.network"
              [token]="this.tplToken.value"
              [tokenLogo]="this.tplToken.logoRoute"
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
              [baseCurrency]="this.tplToken"
              [quotePrice]="this.quotePrice"
              [showRange]="false"
              [disclaimer]="false"
              [max]="this.balance"
              [minimumWarrantyAmount]="this.minimumWarrantyAmount"
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
    amount: [0, [Validators.required]],
    quoteAmount: [0, [Validators.required, CustomValidators.greaterThan(0)]],
    dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(9), Validators.pattern('[0-9]*$')]],
  });
  modalHref: string;
  leave$ = new Subject<void>();
  balance: number;
  quotePrice: number;
  isLoading = false;
  modalOpened: boolean;
  minimumWarrantyAmount: string;
  tplToken: RawToken;
  private readonly priceRefreshInterval = 15000;
  private _lender: Lender;
  private _token: Token;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private walletService: WalletService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private warrantyDataService: WarrantyDataService,
    private dynamicPriceFactory: DynamicPriceFactory,
    private modalFactoryInjectable: ModalFactoryInjectable,
    private ionicStorageService: IonicStorageService,
    private activeLenderInjectable: ActiveLenderInjectable,
    private blockchainsFactory: BlockchainsFactory
  ) {}

  async ionViewWillEnter() {
    this.modalHref = window.location.href;
    await this._setLender();
    await this._setToken();
    await this.walletService.walletExist();
    this.dynamicPrice();
    await this.tokenBalance();
    this.checkBalance();
    this.checkUserStoredInformation();
    await this._setMinimumWarrantyAmount();
  }

  private async userWallet(): Promise<string> {
    return await this.storageService.getWalletsAddresses(this._token.network());
  }

  private async _setLender() {
    this._lender = await this.activeLenderInjectable.create().value();
  }

  private async _setToken() {
    this._token = await new TokenByAddress(
      this.apiWalletService.getCoin(this._lender.token(), this._lender.blockchain()).contract,
      new BlockchainTokens(
        this.blockchainsFactory.create().oneByName(this._lender.blockchain()),
        new DefaultTokens(new TokenRepo(this.apiWalletService.getCoins()))
      )
    ).value();
    this.tplToken = this._token.json();
  }

  private dynamicPrice() {
    this.dynamicPriceFactory
      .new(this.priceRefreshInterval, this._token.json(), this.apiWalletService)
      .value()
      .pipe(takeUntil(this.leave$))
      .subscribe((price: number) => {
        this.quotePrice = price;
      });
  }

  async tokenBalance() {
    const tokenBalance = parseFloat(
      await this.walletService.balanceOf(await this.userWallet(), this._token.symbol(), this._token.network())
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
    this.warrantyDataService.data = {
      amount: roundedAmount,
      quoteAmount: roundedQuoteAmount,
      user_dni: this.form.value.dni,
      lender: this._lender.json().name,
    };
  }

  goToSummary() {
    this.navController.navigateForward('warranties/warranty-summary');
  }

  submitForm() {
    this.isLoading = true;
    if (this.form.valid) {
      this.saveWarrantyData();
      this.goToSummary();
    }
    this.isLoading = false;
  }

  async openBalanceModal() {
    if (!this.modalOpened && window.location.href === this.modalHref) {
      this.modalOpened = true;
      const modal = this.modalFactoryInjectable
        .create()
        .oneBy(Modals.BALANCE, [
          this._token,
          'warranties.insufficient_balance.text',
          'warranties.insufficient_balance.buy_button',
          'warranties.insufficient_balance.deposit_button',
        ]);
      await modal.show();
      modal.onDidDismiss().then(() => (this.modalOpened = false));
    }
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }

  async checkUserStoredInformation() {
    const savedDocument = await this.ionicStorageService.get('user_dni');
    if (savedDocument) {
      this.form.patchValue({ dni: savedDocument });
    }
  }

  private async _setMinimumWarrantyAmount() {
    this.minimumWarrantyAmount = (await this.activeLenderInjectable.create().value()).minWarrantyAmount();

    this.addValidator(this.minimumWarrantyAmount);
  }

  addValidator(amount: string) {
    this.form.get('amount').addValidators(CustomValidators.greaterOrEqualThan(parseInt(amount)));
  }
}
