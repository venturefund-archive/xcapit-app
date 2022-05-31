import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-voucher-card',
  template: `
    <ion-card class="ux-card ion-no-margin vc">
      <div class="vc__header">
        <ion-text class="ux-font-text-lg">
          {{ 'fiat_ramps.operation_detail.voucher_card.header' | translate }}
        </ion-text>
      </div>
      <div *ngIf="this.voucher; then file; else success"></div>
      <ng-template #file>
        <div class="vc__file">
          <div class="vc__file__text-container">
            <ion-text class="ux-font-titulo-xs vc__file__text-container__title">
              {{ 'fiat_ramps.operation_detail.voucher_card.file' | translate }}
            </ion-text>
            <ion-text>
              <ion-button
                class="ux-link-xl ion-no-margin ion-no-padding vc__file__text-container__link"
                fill="clear"
                size="small"
              >
                asd
              </ion-button>
            </ion-text>
          </div>
          <div class="vc__file__trash">
            <ion-button class="ion-no-margin" fill="clear" size="small">
              <ion-icon name="ux-trash"></ion-icon>
            </ion-button>
          </div>
        </div>
      </ng-template>
      <ng-template #success>
        <div class="vc__success">
          <div class="vc__success__text">
            <ion-text class="ux-font-text-base-black">El comprobante se envió correctamente</ion-text>
          </div>
          <div class="vc__success__icon">
            <ion-icon name="ux-checked-circle"></ion-icon>
          </div>
        </div>
      </ng-template>
    </ion-card>
  `,
  styleUrls: ['./voucher-card.component.scss'],
})
export class VoucherCardComponent implements OnInit {
  @Input() voucher: any;

  constructor() {}

  ngOnInit() {}
}
