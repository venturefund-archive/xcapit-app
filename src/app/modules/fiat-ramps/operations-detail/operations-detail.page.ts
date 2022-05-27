import { Component, OnInit } from '@angular/core';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Filesystem } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';

@Component({
  selector: 'app-operations-detail',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/select-provider"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.operation_detail.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding dp" *ngIf="this.operation">
      <div class="dp__card-container" *ngIf="this.operation.voucher; then voucher; else transferData"></div>
      <ng-template #voucher>
        <app-voucher-card></app-voucher-card>
      </ng-template>
      <ng-template #transferData>
        <app-bank-info-card [provider]="this.provider"></app-bank-info-card>
      </ng-template>
      <div class="dp__card-container">
        <app-operation-detail-card [operation]="this.operation" [provider]="this.provider"></app-operation-detail-card>
      </div>
      <div class="dp__disclaimer">
        <div class="dp__disclaimer__text">
          <ion-text class="ux-font-text-xxs">
            {{ 'fiat_ramps.operation_detail.disclaimer1' | translate }}
          </ion-text>
          <br>
          <ion-text class="ux-font-text-xxs">
            {{ 'fiat_ramps.operation_detail.disclaimer2' | translate }}
          </ion-text>
        </div>
        <div class="dp__disclaimer__support">
          <ion-text class="ux-font-text-xxs">
            {{ 'fiat_ramps.operation_detail.support_text' | translate }}
            <ion-button class="ux-link-xs ion-no-margin ion-no-padding" fill="clear" size="small">
              {{ 'fiat_ramps.operation_detail.support_button' | translate }}
            </ion-button>
          </ion-text>
        </div>
      </div>
      <div class="dp__upload-voucher" *ngIf="!this.operation.voucher">
        <ion-button class="ux_button ion-no-margin" color="secondary" expand="full">
          {{ 'fiat_ramps.operation_detail.upload_voucher' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./operations-detail.page.scss'],
})
export class OperationsDetailPage implements OnInit {
  provider: FiatRampProvider;
  operation: FiatRampOperation;
  comprobante = null;
  cotizacion: any = 0;
  hasVoucher: boolean = false;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fiatRampsService: FiatRampsService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    const operationId = this.route.snapshot.paramMap.get('operation_id');
    const providerId = this.route.snapshot.paramMap.get('provider_id');
    this.getProvider(parseInt(providerId));
    this.getUserOperation(operationId);
  }

  private getProvider(providerId: number) {
    this.provider = this.fiatRampsService.getProvider(providerId);
  }

  ngOnInit() {}

  async addPhoto() {
    const filePermissions = await Filesystem.requestPermissions();
    const cameraPermissions = await Camera.requestPermissions();

    const photo = await Camera.getPhoto({
      source: CameraSource.Prompt,
      saveToGallery: false,
      resultType: CameraResultType.DataUrl,
    });

    this.comprobante = photo;
  }

  private async getUserOperation(operationId: string) {
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.fiatRampsService.getUserSingleOperation(operationId).subscribe({
      next: (data) => {
        this.operation = data[0];
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
    if (this.provider.alias === 'kripton') {
      this.hasVoucher = this.operation.voucher;
    }
  }

  navigateBackToOperations() {
    this.navController.navigateBack(['/fiat-ramps/select-provider']);
  }
}
