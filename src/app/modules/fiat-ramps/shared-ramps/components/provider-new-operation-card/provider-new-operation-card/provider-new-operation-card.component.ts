import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { Coin } from '../../../../../wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampProvider } from '../../../interfaces/fiat-ramp-provider.interface';

@Component({
  selector: 'app-provider-new-operation-card',
  template: `
    <ion-card class="ux-card-new pnoc">
      <div class="pnoc__currency-select">
        <app-coin-selector
          *ngIf="coin"
          [selectedCoin]="coin"
          (changeCurrency)="this.emitChangeCurrency()"
          [enabled]="this.coinSelectorEnabled"
        ></app-coin-selector>
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
            <ion-input appNumberInput formControlName="cryptoAmount" type="number" inputmode="numeric"> </ion-input>
          </div>
          <ion-text class="pnoc__amount-select__inputs__equal ux-fweight-medium ">=</ion-text>
          <div class="pnoc__amount-select__inputs__quoteAmount">
            <ion-input appNumberInput formControlName="fiatAmount" type="number" inputmode="numeric"></ion-input>
          </div>
        </div>
      </div>

      <div *ngIf="this.amountUSDEnabled" class="pnoc__amount-select">
        <div class="pnoc__amount-select__qty-label">
          <ion-label class="ux-font-titulo-xs">{{
            'fiat_ramps.shared.provider_new_operation_card.to_pay' | translate
          }}</ion-label>
        </div>
        <div class="pnoc__amount-select__labels">
          <ion-label class="ux-font-text-xs pnoc__amount-select__labels__base" color="primary">
            USD
          </ion-label>         
        </div>
        <div class="pnoc__amount-select__inputs">
          <div class="pnoc__amount-select__inputs__amount">
            <ion-input appNumberInput formControlName="fiatAmount" type="number" inputmode="numeric"> </ion-input>
          </div>
        </div>
        <ion-text class="ux-font-text-xs pnoc__amount-select__usd-disclaimer">{{
            'fiat_ramps.shared.provider_new_operation_card.usd_disclaimer' | translate
          }}</ion-text>
      </div>

      <div class="pnoc__provider">
        <div class="pnoc__provider__label">
          <ion-text class="ux-font-titulo-xs">{{
            'fiat_ramps.shared.provider_new_operation_card.provider' | translate
          }}</ion-text>
        </div>
        <div class="pnoc__provider__content ux-card ion-padding">
          <div class="pnoc__provider__content__img">
            <img [src]="this.provider.logoRoute" />
          </div>
          <div class="pnoc__provider__content__body">
            <div class="pnoc__provider__content__body__provider-name">
              <ion-text class="pnoc__provider__content__body__text__name ux-font-text-lg">{{ this.provider.name }}</ion-text>
            </div>
            <div class="ux-font-text-xxs">
              <ion-text class="pnoc__provider__content__body__description">{{ this.provider?.description | translate }}</ion-text>
            </div>
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
export class ProviderNewOperationCardComponent implements OnInit {
  @Input() coin: Coin;
  @Input() amountEnabled = true;
  @Input() amountUSDEnabled = false;
  @Input() fiatCurrency = 'USD';
  @Input() provider: FiatRampProvider;
  @Input() coinSelectorEnabled = true;
  @Output() changeCurrency = new EventEmitter<void>();

  form: FormGroup;
  constructor(private formGroupDirective: FormGroupDirective) {}

  ngOnInit() {
    this.form = this.formGroupDirective.form;
  }

  emitChangeCurrency(): void {
    this.changeCurrency.emit();
  }
}
