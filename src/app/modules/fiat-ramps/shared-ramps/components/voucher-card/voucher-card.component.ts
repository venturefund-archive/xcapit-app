import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { VoucherModalComponent } from '../voucher-modal/voucher-modal.component';

@Component({
  selector: 'app-voucher-card',
  template: `
    <div class="vc">
      <div class="vc__header">
        <ion-text class="ux-font-text-lg">
          {{ 'fiat_ramps.purchase_order.voucher_card.header' | translate }}
        </ion-text>
      </div>
      <div *ngIf="this._percentage > 0; then loader; else voucherEl"></div>
      <ng-template #loader>
        <div class="vc__loader">
          <ion-card class="card dotted ion-no-margin">
            <div class="vc__loader__texts">
              <div class="vc__loader__texts__placeholder">
                <ion-text class="ux-font-text-base">
                  {{ 'fiat_ramps.purchase_order.voucher_card.file_placeholder' | translate }}
                </ion-text>
              </div>
              <div class="vc__loader__texts__percentage">
                <ion-text class="ux-font-text-xs"> {{ this._percentage }} % </ion-text>
              </div>
            </div>
            <div class="vc__loader__bar">
              <div
                class="vc__loader__bar__loading"
                [style.width.%]="this._percentage"
                [ngClass]="this.loaderCssClass"
              ></div>
            </div>
          </ion-card>
        </div>
      </ng-template>
      <ng-template #voucherEl>
        <div *ngIf="!!this.voucher; then success; else file"></div>
        <ng-template #file>
          <div class="vc__file">
            <ion-card class="card dotted ion-no-margin">
              <div class="container">
                <div class="vc__file__button" (click)="this.uploadPhoto()">
                  <div class="vc__file__button__icon">
                    <img src="assets/img/fiat-ramps/kripton-purchase-order/cloud-upload.svg" />
                  </div>
                  <div class="vc__file__button__title">
                    <ion-text class="ux-link-xl">
                      {{ 'fiat_ramps.purchase_order.voucher_card.upload_button' | translate }}
                    </ion-text>
                  </div>
                </div>
                <div class="vc__file__footnote">
                  <ion-text class="ux-font-text-xs">
                    {{ 'fiat_ramps.purchase_order.voucher_card.footnote' | translate }}
                  </ion-text>
                </div>
              </div>
            </ion-card>
          </div>
        </ng-template>
        <ng-template #success>
          <div class="vc__success">
            <ion-card class="card success ion-no-margin">
              <div class="vc__success__header">
                <div class="vc__success__header__right">
                  <div class="vc__success__header__right__icon">
                    <ion-icon name="check-circle" color="successdark"></ion-icon>
                  </div>
                  <div class="vc__success__header__right__text">
                    <ion-text class="ux-font-text-base">
                      {{ 'fiat_ramps.purchase_order.voucher_card.success' | translate }}
                    </ion-text>
                  </div>
                </div>
                <div class="vc__success__header__trash">
                  <ion-button
                    class="ion-no-margin"
                    name="delete-photo"
                    fill="clear"
                    size="small"
                    color="info"
                    (click)="this.removePhotoEvent()"
                  >
                    <ion-icon name="ux-trash"></ion-icon>
                  </ion-button>
                </div>
              </div>
              <div class="vc__success__photo" (click)="this.openVoucher()">
                <img [src]="this.voucher.dataUrl" />
              </div>
            </ion-card>
          </div>
        </ng-template>
      </ng-template>
    </div>
  `,
  styleUrls: ['./voucher-card.component.scss'],
})
export class VoucherCardComponent implements OnInit {
  @Input() voucher: Photo;
  @Input() set percentage(value: number) {
    this._percentage = value;

    if (this._percentage === 100) {
      setTimeout(() => (this.loaderCssClass = 'loader-success'), 500);
      setTimeout(() => (this._percentage = -1), 1000);
    }
  }
  @Output() removePhoto: EventEmitter<any> = new EventEmitter<any>();
  @Output() addPhoto: EventEmitter<any> = new EventEmitter<any>();

  _percentage: number;
  loaderCssClass: string;
  isModalOpen = false;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  removePhotoEvent() {
    this.removePhoto.emit();
  }

  uploadPhoto() {
    this.addPhoto.emit();
  }

  async openVoucher() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const modal = await this.modalController.create({
        component: VoucherModalComponent,
        cssClass: 'modal',
        componentProps: {
          voucher: this.voucher
        },
      });
      await modal.present();
      await modal.onDidDismiss();
      this.isModalOpen = false;
    }
  }
}
