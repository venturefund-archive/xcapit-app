import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { LINKS } from '../../../config/static-links';
import { PlatformService } from '../../../shared/services/platform/platform.service';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { UserStatus } from '../../usuarios/shared-usuarios/enums/user-status.enum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register-apikeys',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/apikeys/list"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'apikeys.register.header' | translate }}</ion-title>
        <ion-label *ngIf="this.isTutorialStep" class="step_counter" slot="end"
          >3 {{ 'shared.step_counter.of' | translate }} 3</ion-label
        >
      </ion-toolbar>
      <app-ux-step-progress-bar progress="80%" *ngIf="this.isTutorialStep"> </app-ux-step-progress-bar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <div class="ik__ak_input">
            <app-ux-input
              controlName="alias"
              type="text"
              inputmode="text"
              [label]="'apikeys.register.label_alias' | translate"
              [placeholder]="'apikeys.register.placeholder_alias' | translate"
            ></app-ux-input>
            <div class="ik__use-qr">
              <div class="ik__use-qr__input">
                <app-ux-input
                  controlName="api_key"
                  type="text"
                  inputmode="text"
                  [label]="'apikeys.register.label_apikey' | translate"
                  [placeholder]="'apikeys.register.placeholder_apikey' | translate"
                ></app-ux-input>
              </div>
              <div class="ik__use-qr__button" *ngIf="!this.inPWA">
                <ion-button
                  color="uxsemidark"
                  appTrackClick
                  name="Use QR"
                  type="button"
                  fill="clear"
                  (click)="this.readQRCode()"
                >
                  <ion-icon name="qr-code-outline"></ion-icon>
                </ion-button>
              </div>
            </div>
            <app-ux-input
              controlName="secret_key"
              type="text"
              inputmode="text"
              [label]="'apikeys.register.label_secretkey' | translate"
              [placeholder]="'apikeys.register.placeholder_secretkey' | translate"
            ></app-ux-input>
          </div>
        </div>
        <div class="ux_footer">
          <div class="ik__need-help">
            <app-need-help
              [whatsAppLink]="this.supportLinks.apiKeyWhatsappSupport"
              [telegramLink]="this.supportLinks.apiKeyTelegramSupport"
            ></app-need-help>
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
              {{ 'apikeys.register.button_submit' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./register-apikeys.page.scss'],
})
export class RegisterApikeysPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    alias: [
      '',
      [
        Validators.required,
        Validators.maxLength(23),
        CustomValidators.patternValidator(/^[a-zA-Z0-9]+$/, CustomValidatorErrors.hasSpecialCharacter),
      ],
    ],
    api_key: ['', [Validators.required]],
    secret_key: ['', [Validators.required]],
  });

  supportLinks = LINKS;
  inPWA = true;
  userStatus: any;
  isTutorialStep = false;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private apiApikeysService: ApiApikeysService,
    private translate: TranslateService,
    private navController: NavController,
    private toastService: ToastService,
    private storageApiKeysService: StorageApikeysService,
    private platformService: PlatformService,
    private apiUsuariosService: ApiUsuariosService,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.checkIsTutorialStep();
    this.patchFormValue();
    this.checkIsWebPlatform();
    this.getUserStatus();
  }

  async getUserStatus() {
    this.apiUsuariosService.status(false).subscribe((res) => (this.userStatus = res));
  }

  checkIsTutorialStep() {
    this.isTutorialStep = this.router.url === '/apikeys/tutorial/register';
  }

  checkIsWebPlatform() {
    this.inPWA = this.platformService.isWeb();
  }

  patchFormValue() {
    if (this.storageApiKeysService.data) {
      this.form.patchValue(this.storageApiKeysService.data);
    }
  }

  handleSubmit() {
    if (this.form.valid) {
      this.submitData();
    } else {
      this.form.markAllAsTouched();
    }
  }

  submitData() {
    const data = this.form.value;
    this.apiApikeysService.create(data).subscribe(async (res) => {
      this.success(res, this.getSuccessRoute());
    });
  }

  getSuccessRoute(): string {
    let route = '/apikeys/success-register';

    if (this.isFirstFund()) {
      route += '-beginner';
    }

    return route;
  }

  isFirstFund(): boolean {
    return this.isBeginnerUser() || this.isExplorerUser() || this.isCreatorUser();
  }

  isBeginnerUser(): boolean {
    return this.userStatus.status_name === UserStatus.BEGINNER;
  }

  isExplorerUser(): boolean {
    return this.userStatus.status_name === UserStatus.EXPLORER;
  }

  isCreatorUser(): boolean {
    return this.userStatus.status_name === UserStatus.CREATOR;
  }

  success(apiKeys: any, route: string) {
    this.navController.navigateForward([route]).then(() => {
      this.storageApiKeysService.updateData(apiKeys);
      this.form.reset();
    });
  }

  error() {
    this.showToast('errorCodes.apikeys.create.default');
  }

  readQRCode() {
    this.navController.navigateForward(['/apikeys/scan']).then();
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

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text),
    });
  }
}
