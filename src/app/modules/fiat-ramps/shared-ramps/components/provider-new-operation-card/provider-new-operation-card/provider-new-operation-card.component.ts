import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Coin } from '../../../../../wallets/shared-wallets/interfaces/coin.interface';
import { INFO_PROVIDER } from '../../../constants/info-provider';
import { FiatRampProvider } from '../../../interfaces/fiat-ramp-provider.interface';
import { FeeInfoModalComponent } from '../../fee-info-modal/fee-info-modal.component';
import { InfoProviderKriptonComponent } from '../../info-provider-kripton/info-provider-kripton.component';
import { InfoProviderMoonpayComponent } from '../../info-provider-moonpay/info-provider-moonpay.component';
import { InfoProviderComponent } from '../../info-provider/info-provider.component';

@Component({
  selector: 'app-provider-new-operation-card',
  template: `
    <ion-card class="ux-card-new pnoc">
      <div *ngIf="coin" class="pnoc__currency-select">
        <app-coin-selector
          *ngIf="!showToken"
          [selectedCoin]="coin"
          (changeCurrency)="this.emitChangeCurrency()"
          [enabled]="this.coinSelectorEnabled"
        ></app-coin-selector>
        <app-asset-detail
          *ngIf="showToken"
          [blockchain]="blockchain"
          [token]="coin.value"
          [tokenLogo]="logoRoute"
        ></app-asset-detail>
      </div>
      <div *ngIf="this.amountEnabled" class="pnoc__amount-select">
        <div class="pnoc__amount-select__qty-label">
          <ion-label class="ux-font-titulo-xs">{{
            'fiat_ramps.shared.provider_new_operation_card.quantity' | translate
          }}</ion-label>
        </div>
        <div class="pnoc__amount-select__labels">
          <ion-label class="ux-font-text-xs pnoc__amount-select__labels__base" color="primary">
            {{ coin.value }}
          </ion-label>
          <ion-label class="ux-font-text-xs pnoc__amount-select__labels__quote" color="primary">
            {{ this.fiatCurrency | uppercase }}</ion-label
          >
        </div>
        <div class="pnoc__amount-select__inputs">
          <div class="pnoc__amount-select__inputs__amount">
            <ion-input
              appNumberInput
              appCommaToDot
              [debounce]="this.debounce"
              [class.invalid]="
                !this.form.controls.fiatAmount.valid &&
                (this.form.controls.cryptoAmount.touched ||
                  this.form.controls.cryptoAmount.dirty ||
                  this.form.controls.fiatAmount.touched ||
                  this.form.controls.fiatAmount.dirty)
              "
              formControlName="cryptoAmount"
              type="text"
              inputmode="decimal"
            >
            </ion-input>
          </div>
          <ion-text class="pnoc__amount-select__inputs__equal ux-fweight-medium ">=</ion-text>
          <div class="pnoc__amount-select__inputs__quoteAmount">
            <ion-input
              appNumberInput
              appCommaToDot
            [debounce]="this.debounce"
            [class.invalid]="
                !this.form.controls.fiatAmount.valid &&
                (this.form.controls.cryptoAmount.touched ||
                  this.form.controls.cryptoAmount.dirty ||
                  this.form.controls.fiatAmount.touched ||
                  this.form.controls.fiatAmount.dirty)
              "
              formControlName="fiatAmount"
              type="text"
              inputmode="decimal"
            ></ion-input>
          </div>
        </div>
        <div
          class="pnoc__amount-select__inputs-errors"
          *ngIf="
            !this.form.controls.fiatAmount.valid &&
            (this.form.controls.cryptoAmount.touched ||
              this.form.controls.cryptoAmount.dirty ||
              this.form.controls.fiatAmount.touched ||
              this.form.controls.fiatAmount.dirty)
          "
        >
          <ion-icon color="dangerdark" icon="information-error"></ion-icon>
          <ion-label class="pnoc__amount-select__inputs-errors__error ux-font-text-xxs"
            >{{
              'fiat_ramps.shared.provider_new_operation_card.input_error'
                | translate
                  : {
                      amount: this.minimumAmount | formattedAmount : 10 : 2,
                      currency: this.minimumCurrency | uppercase
                    }
            }}
          </ion-label>
        </div>
      </div>

      <div class="pnoc__fee">
        <div class="pnoc__fee__label">
          <ion-text class="ux-font-titulo-xs">{{
            'fiat_ramps.shared.provider_new_operation_card.estimated_fee' | translate
          }}</ion-text>
          <ion-icon name="information-circle" color="info" (click)="this.openFeeInfoModal()"></ion-icon>
        </div>
        <div *ngIf="this.fee.value !== undefined" class="pnoc__fee__amount">
          <ion-text class="ux-font-text-base" color="neutral90"
            >{{ this.fee.value | formattedAmount : this.fee.totalDigits: this.fee.maxDecimals }}
            {{ this.fee.token }}</ion-text
          >
        </div>
        <div *ngIf="this.fee.value === undefined" class="skeleton">
          <ion-skeleton-text style="width: 100%;" animated> </ion-skeleton-text>
        </div>
      </div>

      <div *ngIf="showToken" class="pnoc__fee">
        <div class="pnoc__fee__label">
          <ion-text class="ux-font-titulo-xs">{{
            'fiat_ramps.shared.provider_new_operation_card.estimated_provider_fee' | translate
          }}</ion-text>
          <ion-icon name="information-circle" color="info"></ion-icon>
        </div>
        <div *ngIf="this.providerFee.value !== undefined" class="pnoc__fee__amount">
          <ion-text class="ux-font-text-base" color="neutral90"
            >{{ this.providerFee.value | formattedAmount : this.providerFee.totalDigits: this.providerFee.maxDecimals}}
            {{ this.providerFee.token }}</ion-text
          >
        </div>
        <div *ngIf="this.providerFee.value === undefined" class="skeleton">
          <ion-skeleton-text style="width: 100%;" animated> </ion-skeleton-text>
        </div>
      </div>

      <div class="pnoc__provider">
        <div class="pnoc__provider__label">
          <ion-text class="ux-font-titulo-xs">{{
            'fiat_ramps.shared.provider_new_operation_card.payment_method' | translate
          }}</ion-text>
        </div>
        <div class="pnoc__provider__content ux-card ion-padding">
          <div class="pnoc__provider__content__img">
            <img [src]="this.provider.logoRoute" />
          </div>
          <div class="pnoc__provider__content__body">
            <div class="pnoc__provider__content__body__name_and_description">
              <div class="pnoc__provider__content__body__name_and_description__name">
                <ion-text class="pnoc__provider__content__body__text__name ux-font-text-lg">{{
                  this.paymentType | translate
                }}</ion-text>
              </div>
              <div class="ux-font-text-xxs">
                <ion-text class="pnoc__provider__content__body__name_and_description__description">{{
                  'fiat_ramps.provider_new_operation_card.description'
                    | translate : { providerName: this.provider.name }
                }}</ion-text>
              </div>
            </div>
          </div>
          <div class="pnoc__provider__content__info">
            <ion-icon name="information-circle" color="info" (click)="this.showProviderInfo()"></ion-icon>
          </div>
        </div>

        <div class="pnoc__provider__description">
          <ion-text class="ux-font-text-xxs">
            {{ this.provider.disclaimer | translate }}
          </ion-text>
        </div>
      </div>
    </ion-card>
  `,
  styleUrls: ['./provider-new-operation-card.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ProviderNewOperationCardComponent implements OnInit, OnChanges {
  @Input() coin: Coin;
  @Input() blockchain: string;
  @Input() logoRoute: string;
  @Input() showToken = false;
  @Input() amountEnabled = true;
  @Input() fiatCurrency = 'USD';
  @Input() provider: FiatRampProvider;
  @Input() paymentType: string;
  @Input() coinSelectorEnabled = true;
  @Input() minimumAmount: number;
  @Input() minimumCurrency: string;
  @Input() fee: { value: number; token: string; totalDigits: number; maxDecimals: number };
  @Input() providerFee: { value: number; token: string; totalDigits: number; maxDecimals: number };
  @Input() debounce = 500;
  @Output() changeCurrency = new EventEmitter<void>();
  isInfoModalOpen = false;
  providerInfo: any;
  form: UntypedFormGroup;
  constructor(private formGroupDirective: FormGroupDirective, private modalController: ModalController) {}

  ngOnInit() {
    this.form = this.formGroupDirective.form;
    this.setProviderInfo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.minimumAmount && changes.minimumAmount.currentValue !== undefined) {
      this.minimumAmount = Number(changes.minimumAmount.currentValue);
    }
  }

  emitChangeCurrency(): void {
    this.changeCurrency.emit();
  }

  async openFeeInfoModal() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: FeeInfoModalComponent,
        cssClass: 'modal',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }

  async showProviderInfo() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      if (this.provider.providerName === 'kripton') {
        await this.createKriptonInfoModal();
      }
      if (this.provider.providerName === 'moonpay') {
        await this.createMoonpayInfoModal();
      }
      if (this.provider.providerName !== 'kripton' && this.provider.providerName !== 'moonpay') {
        await this.createOtherProviderInfoModal();
      }
      this.isInfoModalOpen = false;
    }
  }

  setProviderInfo() {
    this.providerInfo = INFO_PROVIDER[this.provider.providerName];
  }

  async createOtherProviderInfoModal() {
    const modal = await this.modalController.create({
      component: InfoProviderComponent,
      componentProps: {
        image: this.provider?.logoRoute,
        title: this.provider?.name,
        subtitle1: this.providerInfo.subtitle_1,
        subtitle2: this.providerInfo.subtitle_2,
        subtitle3: this.providerInfo.subtitle_3,
        description1: this.providerInfo.description_1,
        description2: this.providerInfo.description_2,
        description3: this.providerInfo.description_3,
        disclaimer: this.providerInfo.disclaimer,
        buttonText: 'fiat_ramps.select_provider.modal_info.button',
      },
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }

  async createKriptonInfoModal() {
    const modal = await this.modalController.create({
      component: InfoProviderKriptonComponent,
      componentProps: {
        image: this.provider?.logoRoute,
        title: this.provider?.name,
      },
      cssClass: 'ux-lg-modal-informative-provider-kripton',
      backdropDismiss: false,
    });
    await modal.present();
  }

  async createMoonpayInfoModal() {
    const modal = await this.modalController.create({
      component: InfoProviderMoonpayComponent,
      componentProps: {
        image: this.provider?.logoRoute,
        title: this.provider?.name,
      },
      cssClass: 'ux-lg-modal-informative-provider-moonpay',
      backdropDismiss: false,
    });
    await modal.present();
  }
}
