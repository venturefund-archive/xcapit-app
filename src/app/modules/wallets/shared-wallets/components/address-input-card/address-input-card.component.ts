import { Component, Input, OnInit } from '@angular/core';
import { ClipboardService } from '../../../../../shared/services/clipboard/clipboard.service';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ScanQrModalComponent } from '../../../../../shared/components/scan-qr-modal/scan-qr-modal.component';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';

@Component({
  selector: 'app-address-input-card',
  template: `
    <div class="aic ion-padding">
      <div class="aic__header">
        <div class="aic__header__title">
          <ion-text class="ux-font-titulo-xs">{{ this.title }}</ion-text>
        </div>
        <div class="aic__header__buttons">
          <ion-button
            name="Paste Address"
            appTrackClick
            fill="clear"
            size="small"
            color="uxsemidark"
            (click)="this.pasteClipboardData()"
          >
            <ion-icon name="ux-paste"></ion-icon>
          </ion-button>
          <ion-button
            *ngIf="this.enableQR && !this.isPWA"
            name="Scan QR"
            appTrackClick
            fill="clear"
            size="small"
            color="uxsemidark"
            (click)="this.scanQR()"
          >
            <ion-icon name="ux-qr-scan"></ion-icon>
          </ion-button>
        </div>
      </div>
      <div class="aic__content">
        <app-ux-input-underlined
          [labelLeft]="this.helpText"
          debounce="1000"
          controlName="address"
          type="text"
          id="address-input"
        ></app-ux-input-underlined>
      </div>
    </div>
  `,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  styleUrls: ['./address-input-card.component.scss'],
})
export class AddressInputCardComponent implements OnInit {
  @Input() title: string;
  @Input() helpText: string;
  @Input() enableQR = true;
  isPWA = true;
  form: FormGroup;

  constructor(
    private clipboardService: ClipboardService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastService: ToastService,
    private translate: TranslateService,
    private formGroupDirective: FormGroupDirective,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    this.form = this.formGroupDirective.form;
    this.checkIsWebPlatform();
  }

  checkIsWebPlatform() {
    this.isPWA = this.platformService.isWeb();
  }

  pasteClipboardData() {
    this.clipboardService.read().then((result) => {
      if (result.type === 'text/plain') {
        this.form.patchValue({ address: result.value });
      }
    });
  }

  async scanQR() {
    const modal = await this.modalController.create({
      component: ScanQrModalComponent,
      componentProps: {
        title: 'Some scan title',
        cancelText: 'Some scan cancel text',
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
