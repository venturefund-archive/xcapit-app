import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlContainer, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ScanQrModalComponent } from '../../../../../shared/components/scan-qr-modal/scan-qr-modal.component';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Component({
  selector: 'app-address-input-card',
  template: `
    <div class="aic">
      <div class="aic__info">
        <app-backup-information-card
          [text]="
            'wallets.shared_wallets.address_input_card.disclaimer'
              | translate
                : {
                    network: this.selectedNetwork | formattedNetwork
                  }
          "
          [textClass]="'ux-home-backup-card'"
        >
        </app-backup-information-card>
      </div>
      <div class="aic__header">
        <div class="aic__header__title">
          <ion-text class="ux-font-titulo-xs">{{ this.title }}</ion-text>
        </div>
        <div class="aic__header__buttons">
          <ion-button
            *ngIf="this.enableQR && !this.isPWA"
            name="Scan QR"
            appTrackClick
            fill="clear"
            size="small"
            color="neutral80"
            (click)="this.scanQR()"
          >
            <ion-icon name="ux-qr-scan"></ion-icon>
          </ion-button>
        </div>
      </div>
      <div class="aic__content">
        <app-ux-input
          class="ion-no-padding"
          [placeholder]="'wallets.shared_wallets.address_input_card.placeholder' | translate"
          [pasteType]="'ux-paste'"
          [controlName]="'address'"
          debounce="500"
          type="text"
          id="address-input"
        ></app-ux-input>
        <div *ngIf="this.hideHelpText">
          <div class="aic__content__validator" *ngIf="!this.status">
            <img src="assets/img/defi-investments/shared/transaction-fee/exclamation.svg" />
            <ion-label class="ux-font-text-xxs" color="dangerdark">{{ this.validatorText | translate }}</ion-label>
          </div>
          <div class="aic__content__validator" *ngIf="this.status">
            <ion-icon name="ux-checked-circle-outline" color="successdark"> </ion-icon>
            <ion-label class="ux-font-text-xxs" color="successdark">{{ this.validatorText | translate }}</ion-label>
          </div>
        </div>
        <ion-label *ngIf="!this.hideHelpText" class="aic__content__helpText ux-font-text-xxs">
          {{ this.helpText }}
        </ion-label>
        <ion-button
          [disabled]="!this.hasContacts"
          (click)="onContacts()"
          class="ux-link-xl aic__content__contact-button"
          expand="block"
          appTrackClick
          name="ux_go_to_address_list"
        >
          <ion-icon name="qr-contact"></ion-icon>
          <ion-label>Agenda</ion-label>
        </ion-button>
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
  @Input() selectedNetwork: string;
  @Output() addFromContacts: EventEmitter<void> = new EventEmitter<void>();
  isPWA = true;
  form: UntypedFormGroup;
  control: AbstractControl;
  address: string;
  hideHelpText = false;
  status: boolean;
  hasContacts = false;
  validatorText: string;

  constructor(
    private modalController: ModalController,
    private toastService: ToastService,
    private translate: TranslateService,
    private formGroupDirective: FormGroupDirective,
    private platformService: PlatformService,
    private ionicStorage: IonicStorageService
  ) {}

  ngOnInit() {
    this.form = this.formGroupDirective.form;
    this.checkIsWebPlatform();
    this.checkContactsList();
    this.form.get('address').statusChanges.subscribe((valid) => {
      this.status = valid === 'VALID';
      this.validatorText = this.status
        ? 'wallets.shared_wallets.address_input_card.text_valid'
        : 'wallets.shared_wallets.address_input_card.text_invalid';
      this.hideHelpText = true;
    });
  }

  async checkContactsList() {
    const contacts = await this.ionicStorage.get('contact_list');
    if(contacts){
      this.hasContacts = contacts.some(c => c.networks.includes(this.selectedNetwork));
    }
  }

  checkIsWebPlatform() {
    this.isPWA = this.platformService.isWeb();
  }

  async scanQR() {
    const modal = await this.modalController.create({
      component: ScanQrModalComponent,
      componentProps: {
        title: this.translate.instant('wallets.send.scan_qr.title'),
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

  public onContacts() {
    return this.addFromContacts.emit();
  }
}
