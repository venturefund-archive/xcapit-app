import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlContainer, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ScanQrModalComponent } from '../../../../../shared/components/scan-qr-modal/scan-qr-modal.component';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { Contact } from 'src/app/modules/contacts/shared-contacts/interfaces/contact.interface';
import { ContactDataService } from 'src/app/modules/contacts/shared-contacts/services/contact-data/contact-data.service';

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
        <ion-text class="ux-font-titulo-xs">{{ this.title }}</ion-text>
        <ion-text *ngIf="!this.addressFromContact" class="ux-font-text-xxs aic__header__subtitle">{{
          this.subtitle
        }}</ion-text>
      </div>
      <div class="aic__content">
        <app-ux-input
          *ngIf="!this.addressFromContact"
          class="ion-no-padding"
          [placeholder]="'wallets.shared_wallets.address_input_card.placeholder' | translate"
          [qrScanner]="true"
          [controlName]="'address'"
          debounce="500"
          type="text"
          id="address-input"
          (qrScannerOpened)="scanQR()"
          [native]="!this.isPWA"
        ></app-ux-input>
        <div *ngIf="!this.addressFromContact && !this.contact">
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
        </div>
        <div class="aic__content__contact" *ngIf="this.addressFromContact">
          <app-contact-item
            [name]="this.contact?.name"
            [address]="this.contact?.address"
            [networks]="[selectedNetwork]"
          ></app-contact-item>
        </div>
        <ng-container *ngIf="!this.addressFromContact">
          <ion-button
            *appFeatureFlag="'ff_address_list'"
            [disabled]="!this.hasContacts"
            (click)="this.onContacts()"
            class="ux-link-xl aic__content__contact-button"
            expand="block"
            appTrackClick
            name="ux_go_to_address_list"
          >
            <ion-icon name="qr-contact"></ion-icon>
            <ion-label>{{ 'wallets.shared_wallets.address_input_card.agenda' | translate }}</ion-label>
          </ion-button>
        </ng-container>
        <ng-container *ngIf="this.addressFromContact">
          <ion-button
            name="ux_remove_contact"
            (click)="this.remove()"
            class="ux-link-xl aic__content__contact-button"
            expand="block"
          >
            <ion-label>{{ 'wallets.shared_wallets.address_input_card.remove_contact' | translate }}</ion-label>
          </ion-button>
        </ng-container>
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
  @Input() subtitle: string;
  @Input() helpText: string;
  @Input() enableQR = true;
  @Input() selectedNetwork: string;
  @Input() showContactsPicker = true;
  @Input() addressFromContact = false;
  @Output() addFromContacts: EventEmitter<void> = new EventEmitter<void>();
  @Output() removeContact: EventEmitter<void> = new EventEmitter<void>();
  isPWA = true;
  form: UntypedFormGroup;
  control: AbstractControl;
  address: string;
  hideHelpText = false;
  status: boolean;
  hasContacts = false;
  validatorText: string;
  contact: Contact;
  constructor(
    private modalController: ModalController,
    private toastService: ToastService,
    private translate: TranslateService,
    private formGroupDirective: FormGroupDirective,
    private platformService: DefaultPlatformService,
    private ionicStorage: IonicStorageService,
    private contactDataService: ContactDataService
  ) {}

  ngOnInit() {
    this.form = this.formGroupDirective.form;
    this.checkIsWebPlatform();
    this.checkContactsList();
    this.checkIfIsContact();
    this.suscribeToFormChanges();
  }

  checkIfIsContact() {
    if (this.addressFromContact) {
      this.contact = this.contactDataService.getContact();
    }
  }

  async checkContactsList() {
    const contacts = await this.ionicStorage.get('contact_list');
    if (contacts) {
      this.hasContacts = contacts.some((c) => c.networks.includes(this.selectedNetwork));
    }
  }

  suscribeToFormChanges() {
    this.form.get('address').statusChanges.subscribe((valid) => {
      this.status = valid === 'VALID';
      this.validatorText = this.status
        ? 'wallets.shared_wallets.address_input_card.text_valid'
        : 'wallets.shared_wallets.address_input_card.text_invalid';
      this.hideHelpText = true;
    });
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

  public remove() {
    this.addressFromContact = false;
    this.form.patchValue({ address: '' });
    this.removeContact.emit();
  }
}
