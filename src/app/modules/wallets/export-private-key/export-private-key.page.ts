import { Component, OnInit } from '@angular/core';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { WalletPasswordComponent } from '../shared-wallets/components/wallet-password/wallet-password.component';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { ModalController, NavController } from '@ionic/angular';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-export-private-key',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'wallets.export_private_key.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="epk ion-padding">
      <div class="epk__title">
        <ion-text class="ux-font-text-lg">{{ 'wallets.export_private_key.title' | translate }}</ion-text>
      </div>
      <div class="epk__content">
        <ion-text class="ux-font-text-base">
          {{ 'wallets.export_private_key.content' | translate }}
        </ion-text>
      </div>

      <form [formGroup]="this.form" class="epk__form">
        <ion-label class="ux-font-titulo-xs">{{ 'wallets.export_private_key.select_title' | translate }}</ion-label>
        <app-input-select
          [placeholder]="'wallets.export_private_key.select_placeholder' | translate"
          [modalTitle]="'wallets.export_private_key.select_title' | translate"
          controlName="network"
          [data]="this.networks"
          key="name"
          valueKey="value"
          [translated]="true"
          selectorStyle="modern"
        ></app-input-select>
      </form>

      <div class="ux-card-new epk__card" *ngIf="this.keys">
        <div class="epk__card__item">
          <ion-label class="ux-font-titulo-xs"> {{ 'wallets.export_private_key.address' | translate }}</ion-label>
          <ion-text class="ux-font-text-xs">{{ this.keys.address }}</ion-text>
        </div>
        <div class="epk__card__item pk">
          <ion-label class="ux-font-titulo-xs"> {{ 'wallets.export_private_key.private_key' | translate }}</ion-label>
          <ion-text class="ux-font-text-xs">{{ this.keys.privateKey }}</ion-text>
        </div>
      </div>
      <div class="epk__button" *ngIf="this.keys">
        <ion-button
          color="primary"
          class="ux_button"
          appTrackClick
          name="copy_private_key"
          fill="outline"
          (click)="this.copyPrivateKey()"
        >
          {{ 'wallets.export_private_key.copy_button' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./export-private-key.page.scss'],
})
export class ExportPrivateKeyPage implements OnInit {
  keys: { privateKey: string; address: string };
  networks: { name: string; value: string }[];
  form: UntypedFormGroup = this.formBuilder.group({
    network: ['', Validators.required],
  });
  private password: string;

  constructor(
    private apiWalletService: ApiWalletService,
    private walletEncryptionService: WalletEncryptionService,
    private modalController: ModalController,
    private formBuilder: UntypedFormBuilder,
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    this.setNetworks();
    await this.setPassword();
    this.subscribeToFormChanges();
    this.defaultNetwork();
  }

  private defaultNetwork() {
    this.form.patchValue({ network: this.networks.find((network) => network.value === 'ERC20') });
  }

  private subscribeToFormChanges() {
    this.form.get('network').valueChanges.subscribe((network) => this.setKeysFor(network.value));
  }

  private setNetworks() {
    this.networks = this.apiWalletService.getNetworks().map((network) => ({ name: network, value: network }));
  }

  private async setPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.password = data;
  }

  private async setKeysFor(network: any) {
    try {
      const { privateKey, address } = await this.walletEncryptionService.getDecryptedWalletForNetwork(
        this.password,
        network
      );
      this.keys = { privateKey, address };
    } catch {
      if (this.password !== undefined) {
        await this.toastService.showErrorToast({
          message: this.translate.instant('wallets.export_private_key.error_toast'),
        });
      }
      await this.navController.navigateBack(['/profiles/menu']);
    }
  }

  copyPrivateKey() {
    this.clipboardService.write({ string: this.keys.privateKey }).then(() =>
      this.toastService.showSuccessToast({
        message: this.translate.instant('wallets.export_private_key.success_toast'),
      })
    );
  }

  clearPassword() {
    this.password = undefined;
  }

  ionViewWillLeave() {
    this.clearPassword();
  }
}
