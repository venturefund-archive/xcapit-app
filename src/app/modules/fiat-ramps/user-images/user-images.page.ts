import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { NavController } from '@ionic/angular';
import { Filesystem } from '@capacitor/filesystem';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
@Component({
  selector: 'app-user-images',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-title class="ion-text-center">
          {{ 'fiat_ramps.register.header_images' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding ri">
      <app-ux-text class="ion-padding-top ion-margin-top">
        <div class="ux-font-text-xs  ion-margin-top ion-margin-bottom">
          {{ 'fiat_ramps.register.description_images' | translate }}
        </div>
      </app-ux-text>

      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <!-- agregar foto dni frente -->

        <ion-button
          class="ux_button ri__pic-button"
          appTrackClick
          name="Next"
          type="button"
          color="uxsecondary"
          size="large"
          (click)="this.addPhoto('front_document')"
        >
          <div class="ri__pic-button__button-content" *ngIf="!this.form.controls['front_document'].value.image">
            <div class="ri__pic-button__button-content__icon_files">
              <img src="../../assets/img/dni_frente.svg" alt="DNI Frente" />
            </div>
            <!--ion-icon class="image-outline" slot="end" name="image-outline"></ion-icon-->
            <span class="ux-font-text-base">{{ 'fiat_ramps.register.doc_front' | translate }}</span>
          </div>
          <div class="ri__pic-button__picture" *ngIf="this.form.controls['front_document'].value.image">
            <img [src]="this.form.controls['front_document'].value.image" alt="" />
          </div>
        </ion-button>

        <!-- agregar foto dni dorso -->

        <ion-button
          class="ri__pic-button ux_button"
          appTrackClick
          name="Next"
          type="button"
          color="uxsecondary"
          size="large"
          (click)="this.addPhoto('back_document')"
        >
          <div class="ri__pic-button__button-content" *ngIf="!this.form.controls['back_document'].value.image">
            <div class="ri__pic-button__button-content__icon_files">
              <img src="../../assets/img/dni_dorso.svg" alt="DNI Frente" />
            </div>
            <!--ion-icon class="image-outline" slot="end" name="image-outline"></ion-icon-->
            <span class="ux-font-text-base">{{ 'fiat_ramps.register.doc_back' | translate }}</span>
          </div>
          <div class="ri__pic-button__picture" *ngIf="this.form.controls['back_document'].value.image">
            <img [src]="this.form.controls['back_document'].value.image" alt="" />
          </div>
        </ion-button>

        <!-- agregar foto selfie -->

        <ion-button
          class="ri__pic-button ux_button"
          appTrackClick
          name="Next"
          type="button"
          color="uxsecondary"
          size="large"
          (click)="this.addPhoto('billing')"
        >
          <div class="ri__pic-button__button-content" *ngIf="!this.form.controls['billing'].value.image">
            <div class="ri__pic-button__button-content__icon_files">
              <img src="../../assets/img/dni_selfie.svg" alt="DNI Frente" />
            </div>
            <!--ion-icon class="image-outline" slot="end" name="image-outline"></ion-icon-->
            <span class="ux-font-text-base">{{ 'fiat_ramps.register.selfie' | translate }}</span>
          </div>
          <div class="ri__pic-button__picture" *ngIf="this.form.controls['billing'].value.image">
            <img [src]="this.form.controls['billing'].value.image" alt="" />
          </div>
        </ion-button>

        <div class="ux_footer">
          <div class="button-next">
            <ion-button class="ux_button" appTrackClick name="Next" type="submit" color="uxsecondary" size="large">
              {{ 'fiat_ramps.register.register' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./user-images.page.scss'],
})
export class UserImagesPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    front_document: ['', [Validators.required]],
    back_document: ['', [Validators.required]],
    billing: ['', [Validators.required]],
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  async handleSubmit() {
    this.fiatRampsService.registerUserImages(this.form.value).subscribe((res) => {
      this.navController.navigateForward(['fiat-ramps/confirm-page'], { replaceUrl: true });
    });
  }

  async addPhoto(pic) {
    const filePermissions = await Filesystem.requestPermissions();
    const cameraPermissions = await Camera.requestPermissions();

    const photo = await Camera.getPhoto({
      source: CameraSource.Prompt,
      saveToGallery: false,
      resultType: CameraResultType.DataUrl,
    });

    const res = {
      type: pic,
      image: photo.dataUrl,
    };

    this.form.controls[pic].setValue(res);
  }
}
