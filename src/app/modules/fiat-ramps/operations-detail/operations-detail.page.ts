import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PROVIDERS } from '../shared-ramps/constants/providers';

@Component({
  selector: 'app-operations-detail',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/operations"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'fiat_ramps.operation_detail.header' | translate }}
          <span *ngIf="this.operation"> {{ this.operation.operation_id }} </span>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding dp">
      <app-ux-loading-block *ngIf="!this.operation" minSize="30px"></app-ux-loading-block>

      <div *ngIf="this.operation">
        <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22 ios hydrated ion-padding-top ion-margin-top">
          <div class="ion-margin-top">
            {{ 'fiat_ramps.operation_detail.header' | translate }}
          </div>
        </ion-text>
        <div class="dp__content">
          <ion-text class="ux-font-lato ux-fsize-14 ux-fweight-regular dp__content__text">
            <span class="dp__content__text__title">
              {{ 'fiat_ramps.operation_detail.card.provider' | translate }}
            </span>
            <span> {{ this.provider.name }} </span>
          </ion-text>

          <ion-text class="ux-font-lato ux-fsize-14 ux-fweight-regular dp__content__text">
            <span class="dp__content__text__title"> {{ 'fiat_ramps.operation_detail.card.type' | translate }} </span>
            <span *ngIf="this.operation.operation_type === 'cash-in'">
              {{ 'fiat_ramps.operation_detail.card.buy.operationType' | translate }}
            </span>
            <span *ngIf="this.operation.operation_type === 'cash-out'">
              {{ 'fiat_ramps.operation_detail.card.sell.operationType' | translate }}
            </span>
          </ion-text>

          <ion-text
            class="ux-font-lato ux-fsize-14 ux-fweight-regular dp__content__text"
            *ngIf="this.operation.operation_type === 'cash-in'"
          >
            <span class="dp__content__text__title">
              {{ 'fiat_ramps.operation_detail.card.buy.title' | translate }}
            </span>
            <span>
              {{ this.operation.currency_out | uppercase }}
              {{ 'fiat_ramps.operation_detail.card.buy.with' | translate }} {{ this.operation.currency_in | uppercase }}
            </span>
          </ion-text>

          <ion-text
            class="ux-font-lato ux-fsize-14 ux-fweight-regular dp__content__text"
            *ngIf="this.operation.operation_type === 'cash-out'"
          >
            <span class="dp__content__text__title">
              {{ 'fiat_ramps.operation_detail.card.sell.title' | translate }}
            </span>
            <span>
              {{ this.operation.currency_in | uppercase }}
              {{ 'fiat_ramps.operation_detail.card.sell.with' | translate }}
              {{ this.operation.currency_out | uppercase }}
            </span>
          </ion-text>

          <ion-text class="ux-font-lato ux-fsize-14 ux-fweight-regular dp__content__text">
            <span class="dp__content__text__title">
              {{ 'fiat_ramps.operation_detail.card.amount' | translate }}
            </span>
            <span *ngIf="this.operation.operation_type === 'cash-in'"
              >{{ this.operation.amount_in | currency }}
              <small>{{ this.operation.currency_in }}</small>
            </span>
            <span *ngIf="this.operation.operation_type === 'cash-out'"
              >{{ this.operation.amount_out | currency }}
              <small>{{ this.operation.currency_out }}</small>
            </span>
          </ion-text>

          <ion-text class="ux-font-lato ux-fsize-14 ux-fweight-regular dp__content__text">
            <span class="dp__content__text__title">
              {{ 'fiat_ramps.operation_detail.card.quotation' | translate }}
            </span>
            <span *ngIf="this.operation.currency_in === 'ARS' || this.operation.currency_in === 'USD'">
              1 {{ this.operation.currency_out | uppercase }} = {{ this.cotizacion | number: '1.2-2' }}
              {{ this.operation.currency_in | uppercase }}
            </span>
            <span *ngIf="this.operation.currency_in !== 'ARS' && this.operation.currency_in !== 'USD'">
              1 {{ this.operation.currency_in | uppercase }} = {{ this.cotizacion | number: '1.2-2' }}
              {{ this.operation.currency_out | uppercase }}
            </span>
          </ion-text>

          <ion-text class="ux-font-lato ux-fsize-14 ux-fweight-regular dp__content__text">
            <span class="dp__content__text__title">
              {{ 'fiat_ramps.operation_detail.card.status' | translate }}
            </span>
            <span>{{
              'fiat_ramps.operationStatus.' + this.provider.alias + '.' + this.operation.status | translate
            }}</span>
          </ion-text>

          <ion-text class="ux-font-lato ux-fsize-14 ux-fweight-regular dp__content__text">
            <span class="dp__content__text__title"> {{ 'fiat_ramps.operation_detail.card.date' | translate }} </span>
            <span>{{ this.operation.created_at | date: 'dd/MM/yy' }}</span>
          </ion-text>

          <ion-text class="ux-font-lato ux-fsize-14 ux-fweight-regular dp__content__text">
            <span class="dp__content__text__title"> {{ 'fiat_ramps.operation_detail.card.id' | translate }} </span>
            <span>{{ this.operation.operation_id }}</span>
          </ion-text>
        </div>

        <div *ngIf="this.provider.alias !== 'paxful'">
          <div *ngIf="!this.hasVoucher">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Upload Voucher"
              type="button"
              color="uxsecondary"
              size="large"
              (click)="this.addPhoto()"
              class="dp__pic-button"
            >
              <div class="dp__pic-button__button-content" *ngIf="!this.comprobante">
                <ion-icon class="receipt-outline" slot="end" name="receipt-outline"></ion-icon>
                <span> {{ 'fiat_ramps.operation_detail.voucher' | translate }} </span>
              </div>
              <div class="dp__pic-button__picture" *ngIf="this.comprobante">
                <img [src]="this.comprobante.dataUrl" alt="" />
              </div>
            </ion-button>
          </div>

          <div *ngIf="this.hasVoucher" class="dp__voucher">
            <app-ux-center-img></app-ux-center-img>
            <span>{{ 'fiat_ramps.operation_detail.has_voucher' | translate }}</span>
          </div>

          <div class="updload_voucher" *ngIf="this.comprobante && !this.hasVoucher">
            <app-ux-loading-block *ngIf="this.loading" minSize="60px"></app-ux-loading-block>

            <div class="button-next" *ngIf="!this.loading">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Submit Voucher"
                type="button"
                color="uxsecondary"
                size="large"
                (click)="this.sendPicture()"
              >
                {{ 'fiat_ramps.operation_detail.send' | translate }}
              </ion-button>
            </div>
          </div>
        </div>

        <div class="ux_footer">
          <div class="button-next">
            <ion-button
              class="ux_button"
              appTrackClick
              name="My Operations"
              type="button"
              color="uxsecondary"
              size="large"
              (click)="this.navigateBackToOperations()"
            >
              {{ 'fiat_ramps.operation_detail.my_operations' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./operations-detail.page.scss'],
})
export class OperationsDetailPage implements OnInit {
  comprobante = null;
  operation: any = null;
  cotizacion: any = 0;
  provider: any;
  hasVoucher: any = false;
  loading = false;

  ionViewWillEnter() {
    const operationId = this.route.snapshot.paramMap.get('operation_id');
    const providerId = this.route.snapshot.paramMap.get('provider_id');
    this.provider = this.getProvider(providerId);
    this.getUserOperation(operationId);
  }

  getProvider(providerId: string) {
    return PROVIDERS.find((provider) => provider.id.toString() === providerId);
  }

  constructor(
    private route: ActivatedRoute,
    private fiatRampsService: FiatRampsService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  async addPhoto() {
    const { Filesystem, Camera } = Plugins;

    const filePermissions = await Filesystem.requestPermissions();
    const cameraPermissions = await Camera.requestPermissions();

    const photo = await Camera.getPhoto({
      source: CameraSource.Prompt,
      saveToGallery: false,
      resultType: CameraResultType.DataUrl,
    });

    this.comprobante = photo;
  }

  async getUserOperation(operationId: string) {
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.fiatRampsService.getUserSingleOperation(operationId).subscribe({
      next: (data) => {
        this.operation = data[0];
        this.calculateQuotation();
        this.verifyVoucher();
      },
      error: (e) => {
        this.navigateBackToOperations();
      },
    });
  }

  async calculateQuotation() {
    let firstAmount = 0;
    let secondAmount = 0;

    if (this.operation.operation_type === 'cash-in') {
      firstAmount = Number(this.operation.amount_in);
      secondAmount = Number(this.operation.amount_out);
    } else {
      firstAmount = Number(this.operation.amount_out);
      secondAmount = Number(this.operation.amount_in);
    }

    this.cotizacion = firstAmount / secondAmount;
  }

  async sendPicture() {
    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.comprobante.dataUrl);
    this.fiatRampsService.confirmOperation(this.operation.operation_id, formData).subscribe({
      next: (data) => {
        this.loading = false;
        this.hasVoucher = true;
      },
      error: (e) => {
        this.loading = false;
      },
    });
  }

  verifyVoucher() {
    if (this.provider.alias !== 'paxful') {
      this.hasVoucher = this.operation.voucher;
    }
  }

  navigateBackToOperations() {
    this.navController.navigateBack(['/fiat-ramps/operations']);
  }
}
