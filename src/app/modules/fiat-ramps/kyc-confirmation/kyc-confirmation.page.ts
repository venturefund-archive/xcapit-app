import { Component } from '@angular/core';
import { UserKycKriptonImagesService } from '../shared-ramps/services/user-kyc-kripton-images/user-kyc-kripton-images.service';
import { CONFIRMATION_CONTENT } from '../shared-ramps/components/confirmation-content/confirmation-content.constant';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TwoButtonsAlertComponent } from 'src/app/shared/components/two-buttons-alert/two-buttons-alert.component';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { UserKycKriptonImages } from '../shared-ramps/interfaces/user-kyc-kripton-images.interface';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SimplifiedWallet } from '../../wallets/shared-wallets/models/simplified-wallet/simplified-wallet';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { ModalFactoryInjectable } from '../../../shared/models/modal/injectable/modal-factory.injectable';
import { Modals } from '../../../shared/models/modal/factory/default/default-modal-factory';

@Component({
  selector: 'app-kyc-confirmation',
  template: `<app-confirmation-content
    *ngIf="this.data"
    [data]="this.data"
    [image]="this.image"
    (confirm)="this.confirm()"
    (back)="this.goBack()"
    (reload)="this.reloadPhoto()"
  ></app-confirmation-content>`,
  styleUrls: ['./kyc-confirmation.page.scss'],
})
export class KycConfirmationPage {
  image: string;
  confirmationContent = CONFIRMATION_CONTENT;
  data: any;
  digitalDocument: string;

  constructor(
    private userKycKriptonImagesService: UserKycKriptonImagesService,
    private navController: NavController,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private translate: TranslateService,
    private fiatRampsService: FiatRampsService,
    private kriptonStorage: KriptonStorageService,
    private trackService: TrackService,
    private ionicStorageService: IonicStorageService,
    private modalFactoryInjectable: ModalFactoryInjectable
  ) {}

  ionViewWillEnter() {
    this.digitalDocument = this.route.snapshot.paramMap.get('digitalDocument');
    this.data = this.confirmationContent[this.digitalDocument];
    this.image = this.userKycKriptonImagesService.getPhotos()[this.data.documentName];
  }

  private _loadPhotos(): UserKycKriptonImages {
    return this.userKycKriptonImagesService.getPhotos();
  }

  private async _dataWithEmailAndToken(digitalDocuments: UserKycKriptonImages): Promise<any> {
    return {
      ...digitalDocuments,
      email: await this.kriptonStorage.get('email'),
      auth_token: await this.kriptonStorage.get('access_token'),
    };
  }

  private trackButtonEvent() {
    this.trackService.trackEvent({
      eventAction: 'click',
      description: window.location.href,
      eventLabel: 'ux_buy_kripton_id_confirm',
    });
  }

  async confirm() {
    if (this.digitalDocument === 'dni_selfie') {
      this.trackButtonEvent();
      const digitalDocuments = this._loadPhotos();
      const dataWithEmailAndToken = await this._dataWithEmailAndToken(digitalDocuments);
      this.fiatRampsService.registerUserImages(dataWithEmailAndToken).subscribe(async () => {
        await this.kriptonStorage.set('user_status', 'COMPLETE');
        if (await this.isWarrantyWallet()) {
          await this.navController.navigateForward('simplified-home-wallet', {
            queryParams: { showRegistrationModal: true },
          });
        } else {
          await this.navController.navigateForward('tabs/wallets');
        }
        await this._showKmAccountCreationModal();
      });
    } else {
      await this.navController.navigateForward(this.data.nextPageUrl);
    }
  }

  async isWarrantyWallet() {
    return await new SimplifiedWallet(this.ionicStorageService).value();
  }

  private async _showKmAccountCreationModal() {
    await this.modalFactoryInjectable
      .create()
      .oneBy(Modals.GENERAL_WITH_BUTTON, [
        'shared.km_account_creation_modal.title',
        'shared.km_account_creation_modal.description',
        'shared.km_account_creation_modal.buttonText',
        '/fiat-ramps/purchases',
      ])
      .show();
  }

  async goBack() {
    const modal = await this.modalController.create({
      component: TwoButtonsAlertComponent,
      cssClass: 'modal',
      backdropDismiss: false,
      componentProps: {
        title: this.translate.instant('fiat_ramps.kyc.front_id.back_modal.title'),
        description: this.translate.instant('fiat_ramps.kyc.front_id.back_modal.description'),
        confirmButton: this.translate.instant('fiat_ramps.kyc.front_id.back_modal.confirm_button'),
        cancelButton: this.translate.instant('fiat_ramps.kyc.front_id.back_modal.cancel_button'),
      },
    });

    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      await this.navController.navigateBack('/fiat-ramps/user-register');
    }
  }

  reloadPhoto() {
    this.navController.navigateBack(`/fiat-ramps/kyc/validation/${this.digitalDocument}`);
  }
}
