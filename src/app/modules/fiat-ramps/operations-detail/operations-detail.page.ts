import { Component, OnInit } from '@angular/core';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Filesystem } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { OperationDataInterface } from '../shared-ramps/services/operation/storage-operation.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { OperationStatus } from '../shared-ramps/interfaces/operation-status.interface';

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
      <div class="dp__card-container">
        <div *ngIf="!this.hasVoucher">
          <app-bank-info-card [operation]="this.operation" [provider]="this.provider"></app-bank-info-card>
        </div>
        <div *ngIf="this.hasVoucher">
          <app-voucher-card
            [uploading]="this.uploadingVoucher"
            [voucher]="this.voucher"
            (sendVoucher)="this.sendPicture()"
            (removePhoto)="this.removePhoto()"
          ></app-voucher-card>
        </div>
      </div>

      <div class="dp__card-container">
        <app-transfer-confirm-card
          [operationStatus]="this.operationStatus"
          [token]="this.coin"
          [operationData]="this.operation"
          [provider]="this.provider"
        ></app-transfer-confirm-card>
      </div>
      <div class="dp__disclaimer">
        <div class="dp__disclaimer__text">
          <ion-text class="ux-font-text-xxs">
            {{ 'fiat_ramps.operation_detail.disclaimer1' | translate }}
          </ion-text>
          <br />
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
      <div class="dp__upload-voucher" *ngIf="!this.hasVoucher">
        <ion-button class="ux_button ion-no-margin" color="secondary" expand="block" (click)="this.addPhoto()">
          {{ 'fiat_ramps.operation_detail.upload_voucher' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./operations-detail.page.scss'],
})
export class OperationsDetailPage implements OnInit {
  provider: FiatRampProvider;
  operation: OperationDataInterface;
  operationStatus: OperationStatus;
  coin: Coin;
  voucher = null;
  cotizacion: any = 0;
  hasVoucher: boolean = false;
  showBankInfo: boolean = false;
  showVoucher: boolean = false;
  uploadingVoucher: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private apiWalletSertvice: ApiWalletService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    const operationId = this.route.snapshot.paramMap.get('operation_id');
    const providerId = this.route.snapshot.paramMap.get('provider_id');
    this.getProvider(parseInt(providerId));
    this.getUserOperation(operationId);
  }

  private getProvider(providerId: number) {
    this.provider = this.fiatRampsService.getProvider(providerId);
  }

  private async getUserOperation(operationId: string) {
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.fiatRampsService.getUserSingleOperation(operationId).subscribe({
      next: (data) => {
        this.getOperationCoin(data[0].currency_out);
        this.mapOperationData(data[0]);
        this.getOperationStatus(data[0].status);
        this.verifyVoucher();
      },
      error: (e) => {
        this.navigateBackToOperations();
      },
    });
  }

  private getOperationCoin(currencyName: string) {
    this.coin = this.apiWalletSertvice.getCoin(currencyName);
  }

  private mapOperationData(data: FiatRampOperation) {
    if (data.operation_type === 'cash-in') {
      this.operation = {
        type: data.operation_type,
        amount_in: data.amount_in.toString(),
        amount_out: data.amount_out.toString(),
        currency_in: data.currency_in,
        currency_out: data.currency_out,
        price_in: '1',
        price_out: (data.amount_in / data.amount_out).toString(),
        wallet: data.wallet_address,
        provider: data.provider,
        voucher: data.voucher,
        operation_id: data.operation_id,
        network: this.coin.network,
      };
    }
  }

  private getOperationStatus(status: string) {
    this.operationStatus = this.fiatRampsService.getOperationStatus(status, this.provider.id);
  }

  private verifyVoucher() {
    if (this.provider.alias === 'kripton') {
      this.hasVoucher = this.operation.voucher;
    }
  }

  async addPhoto() {
    const filePermissions = await Filesystem.requestPermissions();
    const cameraPermissions = await Camera.requestPermissions();

    const photo = await Camera.getPhoto({
      source: CameraSource.Prompt,
      saveToGallery: false,
      resultType: CameraResultType.DataUrl,
    });

    this.voucher = photo;
    this.hasVoucher = true;
  }

  async sendPicture() {
    this.uploadingVoucher = true;
    const formData = new FormData();
    formData.append('file', this.voucher.dataUrl);
    this.fiatRampsService.confirmOperation(this.operation.operation_id, formData).subscribe({
      next: (data) => {
        this.voucher = undefined;
        this.hasVoucher = true;
        this.uploadingVoucher = false;
      },
      error: () => (this.uploadingVoucher = false),
    });
  }

  navigateBackToOperations() {
    this.navController.navigateBack(['/fiat-ramps/select-provider']);
  }

  removePhoto() {
    this.voucher = undefined;
    this.hasVoucher = false;
  }
}
