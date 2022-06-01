import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-voucher-card',
  template: `
    <ion-card class="ux-card-new ion-no-margin vc">
      <div class="vc__header">
        <ion-text class="ux-font-text-lg">
          {{ 'fiat_ramps.operation_detail.voucher_card.header' | translate }}
        </ion-text>
      </div>
      <div *ngIf="this.uploading; then loader; else voucherEl"></div>
      <ng-template #loader>
        <app-ux-loading-block minSize="30px"></app-ux-loading-block>
      </ng-template>
      <ng-template #voucherEl>
        <div *ngIf="this.voucher; then file; else success"></div>
        <ng-template #file>
          <div class="vc__file">
            <div class="vc__file__text-container">
              <ion-text class="ux-font-titulo-xs vc__file__text-container__title">
                {{ 'fiat_ramps.operation_detail.voucher_card.file' | translate }}
              </ion-text>
              <img [src]="this.voucher.dataUrl" />
            </div>
            <div class="vc__file__trash">
              <ion-button class="ion-no-margin" fill="clear" size="small" (click)="this.removePhotoEvent()">
                <ion-icon name="ux-trash"></ion-icon>
              </ion-button>
            </div>
          </div>
          <div class="vc__send-button">
            <ion-text>
              <ion-button
                name="Send Button"
                class="ux-link-xl ion-no-margin ion-no-padding"
                fill="clear"
                size="small"
                (click)="this.sendVoucherEvent()"
              >
                Enviar
              </ion-button>
            </ion-text>
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
      </ng-template>
    </ion-card>
  `,
  styleUrls: ['./voucher-card.component.scss'],
})
export class VoucherCardComponent implements OnInit {
  @Input() voucher: any;
  @Input() uploading: boolean;
  @Output() sendVoucher: EventEmitter<any> = new EventEmitter<any>();
  @Output() removePhoto: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  removePhotoEvent() {
    this.removePhoto.emit();
  }

  sendVoucherEvent() {
    this.sendVoucher.emit();
  }
}
