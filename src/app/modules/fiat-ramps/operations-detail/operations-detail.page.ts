import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

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
          <span *ngIf="this.operation">{{ this.operation.id }}</span>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding dp">
      <div class="dp__logo">
        <img src="../../assets/img/logo_kripton.png" alt="Logo kripton" />
      </div>

      <app-ux-loading-block *ngIf="!this.operation" minSize="30px"></app-ux-loading-block>

      <div *ngIf="this.operation">
        <div class="dp__content">
          <app-ux-text>
            <span class="dp__content__title"> {{ 'fiat_ramps.operation_detail.type' | translate }} </span>
            <span *ngIf="this.operation"> {{ this.operation.currency_in }} -> {{ this.operation.currency_out }} </span>
          </app-ux-text>

          <app-ux-text>
            <div>
              <span class="dp__content__title"> {{ 'fiat_ramps.operation_detail.amount' | translate }} </span>
              <span *ngIf="this.operation">{{ this.operation.amount_in }}</span>
            </div>
          </app-ux-text>

          <app-ux-text>
            <div *ngIf="this.operation">
              <span class="dp__content__title"> {{ 'fiat_ramps.operation_detail.quotation' | translate }} </span>
              <span *ngIf="this.operation.currency_in === 'ARS' || this.operation.currency_in === 'USD'">
                1 {{ this.operation.currency_out }} = {{ this.cotizacion }} {{ this.operation.currency_in }}
              </span>
              <span *ngIf="this.operation.currency_in !== 'ARS' && this.operation.currency_in !== 'USD'">
                1 {{ this.operation.currency_in }} = {{ this.cotizacion }} {{ this.operation.currency_out }}
              </span>
            </div>
          </app-ux-text>

          <app-ux-text>
            <div>
              <span class="dp__content__title"> {{ 'fiat_ramps.operation_detail.status' | translate }} </span>
              <span *ngIf="this.operation">{{ this.operation.status }}</span>
            </div>
          </app-ux-text>

          <app-ux-text>
            <div>
              <span class="dp__content__title"> {{ 'fiat_ramps.operation_detail.date' | translate }} </span>
              <span *ngIf="this.operation">{{ this.operation.created_at | date }}</span>
            </div>
          </app-ux-text>
        </div>

        <div *ngIf="!this.hasVoucher">
          <ion-button
            class="ux_button"
            appTrackClick
            name="Next"
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

          <div class="ux_footer" *ngIf="this.comprobante">
            <app-ux-loading-block *ngIf="this.loading" minSize="60px"></app-ux-loading-block>

            <div class="button-next" *ngIf="!this.loading">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Next"
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

        <div *ngIf="this.hasVoucher" class="dp__voucher">
          <app-ux-success-img></app-ux-success-img>
          <span>El comprobante ha sido cargado</span>
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
  operationId: string;
  hasVoucher: any = false;
  loading = false;

  ionViewWillEnter() {
    this.operationId = this.route.snapshot.paramMap.get('id');
    this.getUserOperation();
  }

  constructor(
    private route: ActivatedRoute,
    private apiRamps: FiatRampsService,
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

  async getUserOperation() {
    this.apiRamps.getUserSingleOperation(this.operationId).subscribe({
      next: (data) => {
        this.operation = data;
        this.operation.status = this.operation.status.replaceAll('_', ' ');
        this.calcCotizacion();
        this.verifyVoucher();
      },
      error: (e) => {
        this.navController.navigateBack(['/fiat-ramps/operations']);
      },
    });
  }

  async calcCotizacion() {
    let firstAmount = 0;
    let secondAmount = 0;

    firstAmount = Number(this.operation.amount_in);
    secondAmount = Number(this.operation.amount_out);

    this.cotizacion = firstAmount / secondAmount;
  }

  async sendPicture() {
    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.comprobante.dataUrl);
    this.apiRamps.confirmOperation(this.operationId, formData).subscribe({
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
    this.hasVoucher = this.operation.url_voucher_image || this.operation.tx_hash;
  }
}
