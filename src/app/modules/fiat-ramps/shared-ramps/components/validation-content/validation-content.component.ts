import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserKycKriptonImagesService } from 'src/app/modules/fiat-ramps/shared-ramps/services/user-kyc-kripton-images/user-kyc-kripton-images.service';
import { Gallery } from 'src/app/shared/models/photo-source/gallery/gallery';
import { Camera } from 'src/app/shared/models/photo-source/camera/camera';
import { UploadedPhotoInjectable } from 'src/app/shared/models/uploaded-photo/injectable/uploaded-photo.injectable';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { Photo } from 'src/app/shared/models/photo/photo.interface';
@Component({
  selector: 'app-validation-content',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-button class="vc__button-back" (click)="this.goBack()">
            <ion-icon name="chevron-back-outline"></ion-icon
          ></ion-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.shared.validation_content.header' | translate }}
        </ion-title>
        <ion-label class="ux-font-text-xs vc__step_counter" slot="end"
          >{{ this.data.step_from }} {{ 'shared.step_counter.of' | translate }} 3</ion-label
        >
      </ion-toolbar>
      <ion-progress-bar class="vc__progress" [value]="0.25" color="info"></ion-progress-bar>
      <div class="vc__provider">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.shared.validation_content.provider' | translate }}</ion-text>
      </div>
    </ion-header>
    <ion-content class="ion-padding vc__container">
      <div class="vc__container__title" *ngIf="this.data.title">
        <ion-text class="ux-font-text-xl">{{ this.data.title | translate }}</ion-text>
      </div>
      <div class="vc__container__subtitle">
        <ion-text class="ux-font-text-lg">{{ this.data.subtitle | translate }} </ion-text>
      </div>
      <div class="vc__container__description">
        <ion-text class="ux-font-text-base">{{ this.data.description | translate }} </ion-text>
      </div>
      <div class="vc__container__image">
        <img [src]="this.data.imagePath" />
      </div>
    </ion-content>
    <ion-footer class="vc__footer">
      <div class="vc__footer__take-photo">
        <ion-button
          class="ux_button vc__footer__take-photo__button"
          name="take_photo"
          color="secondary"
          expand="block"
          (click)="this.takePhoto()"
          >{{ 'fiat_ramps.shared.validation_content.button_primary' | translate }}</ion-button
        >
      </div>
      <div class="vc__footer__upload-button">
        <ion-button
          class="ux-button-outlined vc__footer__upload-button__button"
          name="upload_photo"
          expand="block"
          (click)="this.uploadPhoto()"
          >{{ 'fiat_ramps.shared.validation_content.button_secondary' | translate }}</ion-button
        >
      </div>
    </ion-footer>`,
  styleUrls: ['./validation-content.component.scss'],
})
export class ValidationContentComponent implements OnInit {
  @Input() data: any;
  @Output() backButton: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private userKycKriptonImagesService: UserKycKriptonImagesService,
    private uploadedPhoto: UploadedPhotoInjectable
  ) {}

  ngOnInit() {}

  async takePhoto() {
    const photo: Photo = await this.uploadedPhoto.create(new Camera()).value();
    this.updateFrontDocument(photo);
  }

  async uploadPhoto() {
    const photo: Photo = await this.uploadedPhoto.create(new Gallery()).value();
    this.updateFrontDocument(photo);
  }

  private updateFrontDocument(photo: Photo): void {
    this.userKycKriptonImagesService.update({ front_document: photo.path() });
    this.confirm.emit();
  }

  async goBack() {
    this.backButton.emit();
  }
}
