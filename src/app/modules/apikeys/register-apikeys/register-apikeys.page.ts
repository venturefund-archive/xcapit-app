import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { Plugins } from '@capacitor/core';
import { QrScannerComponent } from '../shared-apikeys/components/qr-scanner/qr-scanner.component';
import { Subject } from 'rxjs';
import { timeout } from 'rxjs/operators';
@Component({
  selector: 'app-register-apikeys',
  template: `
    <app-qr-scanner
      class="container"
      *ngIf="this.scanning"
      (scannedApikeysEvent)="this.apikeysScanned($event)"
    ></app-qr-scanner>
    <ion-header *ngIf="!this.scanning">
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/apikeys/list"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'apikeys.register.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" *ngIf="!this.scanning">
      <form
        [formGroup]="this.form"
        (ngSubmit)="this.handleSubmit()"
        class="ux_main"
      >
        <div class="ux_content">
          <div class="ik__ak_input">
            <app-ux-input
              controlName="alias"
              type="text"
              inputmode="text"
              [label]="'apikeys.register.label_alias' | translate"
              [placeholder]="'apikeys.register.placeholder_alias' | translate"
            ></app-ux-input>
            <app-ux-input
              controlName="api_key"
              type="text"
              inputmode="text"
              [label]="'apikeys.register.label_apikey' | translate"
              [placeholder]="'apikeys.register.placeholder_apikey' | translate"
            ></app-ux-input>
            <app-ux-input
              controlName="secret_key"
              type="text"
              inputmode="text"
              [label]="'apikeys.register.label_secretkey' | translate"
              [placeholder]="
                'apikeys.register.placeholder_secretkey' | translate
              "
            ></app-ux-input>
            <ion-button
              class="main__help__button ux_button"
              appTrackClick
              name="NeedHelp"
              fill="clear"
              size="small"
              type="button"
              color="uxsecondary"
              [routerLink]="['/tabs/funds']"
            >
              {{ 'apikeys.register.link_help' | translate }}
            </ion-button>
          </div>
        </div>
        <div class="ux_footer">
          <div class="ik__use_qr_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="UseQR"
              type="button"
              fill="clear"
              size="large"
              (click)="this.readQRCode()"
            >
              {{ 'apikeys.register.button_use_qr' | translate }}
            </ion-button>
          </div>
          <div class="ik__submit_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Submit"
              type="submit"
              color="uxsecondary"
              size="large"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'apikeys.register.button_submmit' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./register-apikeys.page.scss']
})
export class RegisterApikeysPage implements OnInit {
  @ViewChildren(QrScannerComponent) qrScanner : QueryList<QrScannerComponent>;
  form: FormGroup = this.formBuilder.group({
    alias: [
      '',
      [
        Validators.required,
        Validators.maxLength(23),
        CustomValidators.patternValidator(
          /^[a-zA-Z0-9]+$/,
          CustomValidatorErrors.hasSpecialCharacter
        ),
      ],
    ],
    api_key: ['', [Validators.required]],
    secret_key: ['', [Validators.required]],
  });

  scanning: boolean;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private apiApikeysService: ApiApikeysService,
    private alertController: AlertController,
    private translate: TranslateService,
    private navController: NavController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.scanning = false;
  }

  ngAfterViewInit() {
    this.qrScanner.changes.subscribe((r) => {
      if (r.first) {
        r.first.readQRCode();
      }
    });

  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('apikeys.register.alert.title'),
      message: this.translate.instant('apikeys.register.alert.text'),
      buttons: [
        {
          text: this.translate.instant('apikeys.register.alert.button'),
          handler: (_) => this.submitData(),
        },
      ],
    });
    await alert.present();
  }

  handleSubmit() {
    if (this.form.valid) {
      this.showAlert();
    } else {
      this.form.markAllAsTouched();
    }
  }

  submitData() {
    const data = this.form.value;
    this.apiApikeysService.create(data).subscribe(
      () => this.success(),
      () => this.error()
    );
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text),
    });
  }

  success() {
    this.navController
      .navigateForward(['/apikeys/success-register'])
      .then(() => {
        this.form.reset();
      });
  }

  error() {
    this.showToast('errorCodes.apikeys.create.default');
  }

  async readQRCode() {
    this.scanning = true;
  }

  errorCameraAccessDenied() {
    this.showToast('errorCodes.apikeys.create.cameraAccessDenied');
  }

  errorNoContentQR() {
    this.showToast('errorCodes.apikeys.create.noContentQR');
  }

  errorInvalidQR() {
    this.showToast('errorCodes.apikeys.create.invalidQR');
  }

  fillForm(result: any) {
    this.form.patchValue(result);
    this.form.markAllAsTouched();
  }

  apikeysScanned(result: any) {
    this.scanning = false;
    if (result.error) {
      switch (result.errorType) {
        case 'invalidQR':
          this.errorInvalidQR();
          break;
        case 'noContent':
          this.errorNoContentQR();
          break;
        case 'permissionDenied':
          this.errorCameraAccessDenied();
          break;
      }
    } else {
      if (result.scannedApikeys) {
        this.fillForm(result.scannedApikeys);
      }
    }
  }
}
