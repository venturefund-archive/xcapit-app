import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-fiat-input',
  template: `
    <div class="fi__amount-select">
      <div class="fi__amount-select__qty-label">
        <ion-label class="ux-font-titulo-xs fi__amount-select__qty-label__base">{{ this.label | translate }}</ion-label>
      </div>
      <div class="fi__amount-select__labels">
        <ion-label class="ux-font-text-xs fi__amount-select__labels__base" color="primary">
          {{ this.fiatCurrency }}
        </ion-label>
      </div>
      <div class="fi__amount-select__inputs">
        <div class="fi__amount-select__inputs__amount">
          <ion-input [formControlName]="this.formControlName" type="number" inputmode="decimal"> </ion-input>
        </div>
      </div>
      <ion-text class="ux-font-text-xs fi__amount-select__usd-disclaimer">{{ this.disclaimer | translate }}</ion-text>
    </div>
  `,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  styleUrls: ['./fiat-input.component.scss'],
})
export class FiatInputComponent implements OnInit {
  @Input() fiatCurrency = 'USD';
  @Input() formControlName = 'fiatAmount';
  @Input() label: string;
  @Input() disclaimer: string;

  constructor() {}

  ngOnInit() {}
}
