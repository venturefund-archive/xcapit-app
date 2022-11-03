import { Component} from '@angular/core';
import { UserKycKriptonImagesService } from '../shared-ramps/services/user-kyc-kripton-images/user-kyc-kripton-images.service';
import { CONFIRMATION_CONTENT } from '../shared-ramps/components/confirmation-content/confirmation-content.constant';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TwoButtonsAlertComponent } from 'src/app/shared/components/two-buttons-alert/two-buttons-alert.component';

@Component({
  selector: 'app-kyc-confirmation',
  template: `<app-confirmation-content *ngIf="this.data"
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


  constructor(private userKycKriptonImagesService: UserKycKriptonImagesService, 
    private navController: NavController,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private translate: TranslateService) {}

  ionViewWillEnter() {
    this.digitalDocument = this.route.snapshot.paramMap.get('digitalDocument');
    this.data = this.confirmationContent[this.digitalDocument]; 
    this.image = this.userKycKriptonImagesService.getPhotos()[this.data.documentName];
  }

  confirm() {
    this.navController.navigateForward(this.data.nextPageUrl);
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
