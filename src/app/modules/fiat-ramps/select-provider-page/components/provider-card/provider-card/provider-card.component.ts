import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
@Component({
  selector: 'app-provider-card',
  template: `
    <div class="pcc ux-card ion-padding" [ngClass]="{ pcc: this.disabled, 'card-off': !this.disabled }">
      <div class="pcc__content">
        <div class="pcc__content__image">
          <img [src]="this.provider?.logoRoute" alt="Provider Logo" />
        </div>
        <div class="pcc__content__body">
          <div class="ux-font-text-lg">
            <ion-text class="pcc__content__body__name" color="neutral90"> {{ this.provider?.name }}</ion-text>
          </div>
          <div class="ux-font-text-xxs">
            <ion-text class="pcc__content__body__description">{{ this.provider?.description | translate }}</ion-text>
          </div>
        </div>
        <div class="pcc__content__radio">
          <ion-radio
            mode="md"
            slot="end"
            checked="true"
            (click)="this.sendProviderData(this.provider)"
            [disabled]="!this.disabled"
          ></ion-radio>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./provider-card.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ProviderCardComponent {
  @Input() provider: any;
  @Input() disabled: boolean;
  @Output() selectedProvider: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  sendProviderData(provider) {
    this.selectedProvider.emit(provider);
  }
}
