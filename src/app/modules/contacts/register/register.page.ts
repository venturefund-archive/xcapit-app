import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ScanQrModalComponent } from 'src/app/shared/components/scan-qr-modal/scan-qr-modal.component';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { NETWORKS_DATA } from '../shared-contacts/constants/networks';

@Component({
  selector: 'app-register',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button appTrackClick defaultHref="contacts/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="rp__header ion-text-left">{{ 'contacts.register.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="rp">
        <div class="rp__title">
          <ion-label class="ux-font-text-lg">
            {{ 'contacts.register.title' | translate }}
          </ion-label>
        </div>
      </div>
      <form [formGroup]="this.form">
        <div class="ux_main">
          <app-network-selector
            *ngIf="this.networksData"
            controlName="networks"
            [networks]="this.networksData"
          ></app-network-selector>
          <app-ux-input
            [showErrors]="false"
            [disabled]="!this.form.value.networks.length"
            [subLabel]="'contacts.register.address_sublabel' | translate"
            [label]="'contacts.register.address_label' | translate"
            class="ion-no-padding"
            [placeholder]="'contacts.register.address_placeholder' | translate"
            [controlName]="'address'"
            debounce="500"
            type="text"
            id="address-input"
            [qrScanner]="true"
            (qrScannerOpened)="this.openQRScanner()"
            [native]="this.native"
          ></app-ux-input>
          <div class="rp__help-text" *ngIf="this.hideHelpText">
            <div class="rp__help-text__validator" *ngIf="!this.status">
              <img src="assets/img/defi-investments/shared/transaction-fee/exclamation.svg" />
              <ion-label class="ux-font-text-xxs" color="dangerdark">{{ this.validatorText | translate }}</ion-label>
            </div>
            <div class="rp__help-text__validator" *ngIf="this.status">
              <ion-icon name="ux-checked-circle-outline" color="successdark"> </ion-icon>
              <ion-label class="ux-font-text-xxs" color="successdark">{{ this.validatorText | translate }}</ion-label>
            </div>
          </div>
          <app-ux-input
            [label]="'contacts.register.name_label' | translate"
            class="ion-no-padding"
            [placeholder]="'contacts.register.name_placeholder' | translate"
            [controlName]="'name'"
            debounce="500"
            type="text"
            id="address-input"
          ></app-ux-input>
        </div>
      </form>
    </ion-content>
    <ion-footer class="rp__footer">
      <div class="rp__footer__submit-button ion-padding">
        <ion-button
          [appLoading]="this.loading"
          [loadingText]="'contacts.register.loading' | translate"
          class="ux_button rp__footer__submit-button__button"
          appTrackClick
          name="ux_address_confirm"
          (click)="this.handleSubmit()"
          [disabled]="!this.isFormValid()"
          color="secondary"
          >{{ 'contacts.register.submit_text' | translate }}</ion-button
        >
      </div>
    </ion-footer>`,
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public isNativePlatform: boolean;
  _aKey = 'contact_list';
  validatorText: string;
  networksData = structuredClone(NETWORKS_DATA);
  loading: boolean;
  hideHelpText: boolean;
  status: boolean;
  native: boolean;
  form: UntypedFormGroup = this.formBuilder.group({
    networks: ['', [Validators.required]],
    address: [''],
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  constructor(
    private toastService: ToastService,
    private formBuilder: UntypedFormBuilder,
    private platformService: PlatformService,
    private modalController: ModalController,
    private translate: TranslateService,
    private ionicStorageService: IonicStorageService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  isFormValid(): boolean {
    return this.form.valid && this.form.get('address').value;
  }

  async ionViewWillEnter() {
    this.valueChanges();
    this.isNative();
    await this.nullStorage();
    this.subscribeToStatusChanges();
    this.isSaveMode();
  }

  isSaveMode() {
    if (this.route.snapshot.paramMap.get('mode') === 'save') {
      const network = this.networksData.filter(
        (network) => network.value === this.route.snapshot.paramMap.get('blockchain')
      );
      const address = this.route.snapshot.paramMap.get('address');
      this.form.patchValue({ networks: [network[0].value] });
      this.setAddressValidator([network[0].value]);
      this.form.patchValue({ address: address });
    }
  }

  subscribeToStatusChanges() {
    this.form.get('address').statusChanges.subscribe((valid) => {
      this.status = valid === 'VALID';
      this.validatorText = this.status ? 'contacts.register.text_valid' : 'contacts.register.text_invalid';
      this.hideHelpText = true;
    });
  }

  private valueChanges() {
    this.form.get('networks').valueChanges.subscribe((value) => {
      this.setAddressValidator(value);
      this.setCheckedCheckboxes(value);
    });
  }

  setCheckedCheckboxes(networks) {
    for (const network of this.networksData) {
      if (networks.includes(network.value)) {
        network.checked = true;
      } else {
        network.checked = false;
      }
    }
  }

  async setAddressValidator(value) {
    this.form.get('address').clearValidators();
    if (value.includes('SOLANA')) {
      this.form.get('address').addValidators(CustomValidators.isAddressSolana());
    } else {
      this.form.get('address').addValidators(CustomValidators.isAddress());
    }
    if (this.form.get('address').value) {
      this.form.get('address').updateValueAndValidity();
    }
  }

  isNative() {
    this.native = this.platformService.isNative();
  }

  async handleSubmit() {
    this.loading = true;
    if (this.form.valid) {
      const addresses_list = await this.getAddressesList();
      addresses_list.push(this.form.value);
      this.ionicStorageService.set(this._aKey, addresses_list);
      this.navigateToContactsHome();
      this.showSuccessToast();
    }
  }

  navigateToContactsHome() {
    this.navController.navigateRoot('contacts/home');
  }

  showSuccessToast() {
    this.toastService.showSuccessToastVerticalOffset({
      message: this.translate.instant('contacts.register.success_toast'),
    });
  }

  async nullStorage() {
    if ((await this.getAddressesList()) === null) {
      this.ionicStorageService.set(this._aKey, []);
    }
  }

  async getAddressesList() {
    return this.ionicStorageService.get(this._aKey);
  }

  async openQRScanner() {
    const modal = await this.modalController.create({
      component: ScanQrModalComponent,
      componentProps: {
        title: this.translate.instant('contacts.qr_scanner.title'),
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
        await this.showToast(this.translate.instant('contacts.qr_scanner.scan_error'));
        break;
      case 'unauthorized':
        await this.showToast(this.translate.instant('contacts.qr_scanner.scan_unauthorized'));
        break;
    }
  }

  private async showToast(message) {
    await this.toastService.showToast({ message });
  }
}
