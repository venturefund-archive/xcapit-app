import { Component, Input, OnInit } from '@angular/core';
import { ClipboardService } from '../../../../../shared/services/clipboard/clipboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ScanQrModalComponent } from '../../../../../shared/components/scan-qr-modal/scan-qr-modal.component';

@Component({
  selector: 'app-address-input-card',
  template: `
    <div class="aic ion-padding">
      <div class="aic__header">
        <div class="aic__header__title">
          <ion-text>{{ this.title }}</ion-text>
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
            *ngIf="this.enableQR"
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
        <form [formGroup]="this.form">
          <ion-item class="aic__content__item">
            <ion-input id="address-input" formControlName="address"></ion-input>
          </ion-item>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./address-input-card.component.scss'],
})
export class AddressInputCardComponent implements OnInit {
  @Input() title: string;
  @Input() helpText: string;
  @Input() enableQR = true;
  form: FormGroup = this.formBuilder.group({
    address: ['', Validators.required],
  });

  constructor(
    private clipboardService: ClipboardService,
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

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
    if (role === 'success') {
      this.form.patchValue({ address: data });
    }
  }
}
