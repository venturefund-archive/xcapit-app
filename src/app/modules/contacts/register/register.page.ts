import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ScanQrModalComponent } from 'src/app/shared/components/scan-qr-modal/scan-qr-modal.component';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-register',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button appTrackClick name="" defaultHref=""></ion-back-button>
        </ion-buttons>
        <ion-title class="cr__header ion-text-left">{{ 'Agendar wallet' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="cr">
        <div class="cr__title">
          <ion-label class="ux-font-text-lg">
            {{ 'Ingresa los datos de la wallet que deseas agendar.' | translate }}
          </ion-label>
        </div>
      </div>
      <form [formGroup]="this.form">
        <div class="ux_main">
          <app-multiple-checkbox-select
            *ngIf="this.networksData"
            formControlName="networks"
            [networks]="this.networksData"
          ></app-multiple-checkbox-select>
          <app-ux-input
            [label]="'Dirección'"
            class="ion-no-padding"
            [placeholder]="'Mantén presionado para pegar' | translate"
            [controlName]="'address'"
            debounce="500"
            type="text"
            id="address-input"
            [qrScanner]="true"
            (qrScannerOpened)="this.openQRScanner()"
            [native]="this.isNative()"
          ></app-ux-input>
          <app-ux-input
            [label]="'Nombre'"
            class="ion-no-padding"
            [placeholder]="'Ej: Wallet de Laura' | translate"
            [controlName]="'name'"
            debounce="500"
            type="text"
            id="address-input"
          ></app-ux-input>
          <!-- <app-errors-form-item [controlName]="'uri'"></app-errors-form-item> -->
        </div>
      </form>
    </ion-content>
    <ion-footer class="cr__footer">
      <div class="cr__footer__submit-button ion-padding">
        <ion-button
          class="ux_button cr__footer__submit-button__button"
          appTrackClick
          name="ux_send_continue"
          (click)="this.submitForm()"
          [disabled]="!this.form.valid"
          color="secondary"
          >{{ 'Agendar wallet' | translate }}</ion-button
        >
      </div>
    </ion-footer>`,
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public isNativePlatform: boolean;
  form: UntypedFormGroup = this.formBuilder.group({
    networks: ['', []],
    address: ['', []],
    name: ['', []],
  });

  networksData = [
    {
      name: 'ETHEREUM',
      value: 'ETH',
    },
    {
      name: 'RSK',
      value: 'RSK',
    },
    {
      name: 'POLYGON',
      value: 'POL',
    },
    {
      name: 'BINANCE SMART CHAIN',
      value: 'BSC',
    },
    {
      name: 'SOLANA',
      value: 'SOL',
    },
  ];

  constructor(
    private toastService: ToastService,
    private formBuilder: UntypedFormBuilder,
    private platformService: PlatformService,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.isNative();
  }

  isNative() {
    return this.platformService.isNative();
  }

  submitForm() {
    console.log(this.form.value);
  }

  //.....
  //..
  //..
  // INPORTANTE!!!!!!!, VER TRADUCCIONES
  //......
  //....
  //.....

  async openQRScanner() {
    const modal = await this.modalController.create({
      component: ScanQrModalComponent,
      componentProps: {
        title: this.translate.instant('Scan the QR code of the address you want to register'),
      },
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    await this.handleScanResult(data, role);
  }

  async handleScanResult(data, role) {
    switch (role) {
      case 'success':
        this.form.patchValue({ address: data });
        break;
      case 'error':
        await this.showToast(this.translate.instant('wallets.shared_wallets.address_input_card.scan_error'));
        break;
      case 'unauthorized':
        await this.showToast(this.translate.instant('wallets.shared_wallets.address_input_card.scan_unauthorized'));
        break;
    }
  }

  private async showToast(message) {
    await this.toastService.showToast({ message });
  }
}
