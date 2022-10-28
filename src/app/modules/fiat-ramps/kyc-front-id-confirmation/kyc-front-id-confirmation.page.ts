import { Component, OnInit } from '@angular/core';
import { UserKycKriptonImagesService } from '../shared-ramps/services/user-kyc-kripton-images/user-kyc-kripton-images.service';
import { CONFIRMATION_CONTENT } from '../shared-ramps/components/confirmation-content/confirmation-content.constant';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-kyc-front-id-confirmation',
  template: `<app-confirmation-content
    [data]="this.data"
    [image]="this.image"
    (confirm)="this.confirm()"
    (back)="this.goBack()"
  ></app-confirmation-content>`,
  styleUrls: ['./kyc-front-id-confirmation.page.scss'],
})
export class KycFrontIdConfirmationPage {
  image: string;
  data = CONFIRMATION_CONTENT.front_id;

  constructor(private userKycKriptonImagesService: UserKycKriptonImagesService, private navController: NavController) {}

  ionViewWillEnter() {
    this.image = this.userKycKriptonImagesService.getPhotos().front_document;
  }

  confirm() {
    this.navController.navigateForward('/tabs/wallets');
  }

  goBack() {
    this.navController.navigateBack('/fiat-ramps/kyc-front-id');
  }
}
