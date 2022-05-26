import { Component, OnInit } from '@angular/core';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PROVIDERS } from '../shared-ramps/constants/providers';
import { Filesystem } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';

@Component({
  selector: 'app-operations-detail',
  template: `
    <ion-header >
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/select-provider"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.operation_detail.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding dp">
      <app-operation-detail-card [operation]="this.operation"></app-operation-detail-card>
    </ion-content>
  `,
  styleUrls: ['./operations-detail.page.scss'],
})
export class OperationsDetailPage implements OnInit {
  providers: FiatRampProvider[] = PROVIDERS;
  comprobante = null;
  operation: FiatRampOperation;
  cotizacion: any = 0;
  provider: FiatRampProvider;
  hasVoucher: boolean = false;
  loading: boolean = false;

  ionViewWillEnter() {
    const operationId = this.route.snapshot.paramMap.get('operation_id');
    const providerId = this.route.snapshot.paramMap.get('provider_id');
    this.provider = this.getProvider(providerId);
    this.getUserOperation(operationId);
  }

  getProvider(providerId: string) {
    return this.providers.find((provider) => provider.id.toString() === providerId);
  }

  constructor(
    private route: ActivatedRoute,
    private fiatRampsService: FiatRampsService,
    private navController: NavController
  ) {}

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
    this.navController.navigateBack(['/fiat-ramps/select-provider']);
  }
}
