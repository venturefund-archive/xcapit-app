import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { NavController } from '@ionic/angular';
import { ProfilesHelperService } from '../shared-profiles/services/profiles-helper/profiles-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiRunsService } from '../../runs/shared-runs/services/api-runs/api-runs.service';

@Component({
  selector: 'app-user-profile',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'profiles.user_profile.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form
        [formGroup]="this.form"
        (ngSubmit)="this.save()"
        *ngIf="this.isFormSet"
      >
        <ion-item-group class="ion-padding-top">
          <ion-item-divider>
            <ion-label>{{
              'profiles.user_profile.ion_divider1' | translate
            }}</ion-label>
          </ion-item-divider>
          <div class="ion-padding-start ion-padding-end">
            <ion-item>
              <ion-label position="floating">{{
                'profiles.user_profile.first_name' | translate
              }}</ion-label>
              <ion-input formControlName="first_name" type="text"></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="first_name"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'profiles.user_profile.last_name' | translate
              }}</ion-label>
              <ion-input formControlName="last_name" type="text"></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="last_name"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'profiles.user_profile.nro_dni' | translate
              }}</ion-label>
              <ion-input
                formControlName="nro_dni"
                type="text"
                inputmode="numeric"
              ></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="nro_dni"
              [errors]="this.onlyIntegersErrors"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'profiles.user_profile.cellphone' | translate
              }}</ion-label>
              <ion-input
                formControlName="cellphone"
                type="text"
                inputmode="tel"
              ></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="cellphone"
              [errors]="this.cellphoneErrors"
            ></app-errors-form-item>
          </div>
        </ion-item-group>

        <ion-item-group class="ion-padding-top">
          <ion-item-divider>
            <ion-label>{{
              'profiles.user_profile.ion_divider2' | translate
            }}</ion-label>
          </ion-item-divider>
          <div class="ion-padding-start ion-padding-end">
            <ion-item>
              <ion-label position="floating">{{
                'profiles.user_profile.condicion_iva' | translate
              }}</ion-label>
              <ion-select formControlName="condicion_iva">
                <ion-select-option>IVA Responsable Inscripto</ion-select-option>
                <ion-select-option
                  >IVA Responsable no Inscripto</ion-select-option
                >
                <ion-select-option>IVA no Responsable</ion-select-option>
                <ion-select-option>IVA Sujeto Exento</ion-select-option>
                <ion-select-option>Consumidor Final</ion-select-option>
                <ion-select-option>Responsable Monotributo</ion-select-option>
                <ion-select-option>Sujeto no Categorizado</ion-select-option>
                <ion-select-option>Proveedor del Exterior</ion-select-option>
                <ion-select-option>Cliente del Exterior</ion-select-option>
                <ion-select-option
                  >IVA Liberado – Ley Nº 19.640</ion-select-option
                >
                <ion-select-option
                  >IVA Responsable Inscripto – Agente de
                  Percepción</ion-select-option
                >
                <ion-select-option
                  >Pequeño Contribuyente Eventual</ion-select-option
                >
                <ion-select-option>Monotributista Social</ion-select-option>
                <ion-select-option
                  >Pequeño Contribuyente Eventual Social</ion-select-option
                >
              </ion-select>
            </ion-item>
            <app-errors-form-item
              controlName="condicion_iva"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'profiles.user_profile.tipo_factura' | translate
              }}</ion-label>
              <ion-select formControlName="tipo_factura">
                <ion-select-option>A</ion-select-option>
                <ion-select-option>B</ion-select-option>
                <ion-select-option>C</ion-select-option>
              </ion-select>
            </ion-item>
            <app-errors-form-item
              controlName="tipo_factura"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'profiles.user_profile.cuit' | translate
              }}</ion-label>
              <ion-input
                formControlName="cuit"
                type="text"
                inputmode="numeric"
              ></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="cuit"
              [errors]="this.onlyIntegersErrors"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'profiles.user_profile.direccion' | translate
              }}</ion-label>
              <ion-input
                class="google-place-input"
                formControlName="direccion"
                type="text"
                appGooglePlaces
              ></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="direccion"
            ></app-errors-form-item>
          </div>
        </ion-item-group>

        <div class="ion-padding ion-margin-top">
          <ion-button
            appTrackClick
            name="Save Profile"
            expand="block"
            size="large"
            type="submit"
            color="success"
            [disabled]="!this.form.valid || this.disabledButton"
          >
            <ion-icon slot="start" name="save"></ion-icon>
            {{ 'profiles.user_profile.submit_button' | translate }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit {
  disabledButton = false;

  isFormSet = false;

  cellphoneErrors: ItemFormError[] = CONFIG.fieldErrors.cellphone;

  onlyIntegersErrors: ItemFormError[] = CONFIG.fieldErrors.onlyIntegers;

  controls = {
    first_name: ['', [Validators.maxLength(150)]],
    last_name: ['', [Validators.maxLength(150)]],
    nro_dni: [
      '',
      [
        Validators.minLength(7),
        Validators.maxLength(12),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ],
    cellphone: [
      '',
      [
        Validators.minLength(7),
        Validators.maxLength(24),
        Validators.pattern('[0-9()-+][^.a-zA-Z]*$')
      ]
    ],
    condicion_iva: ['', []],
    tipo_factura: ['', []],
    cuit: [
      '',
      [
        Validators.minLength(7),
        Validators.maxLength(15),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ],
    direccion: ['', [Validators.maxLength(150)]]
  };

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiProfiles: ApiProfilesService,
    private toastService: ToastService,
    private navController: NavController,
    private profilesHelper: ProfilesHelperService,
    private translate: TranslateService,
    private apiRuns: ApiRunsService
  ) {}

  ngOnInit() {
    this.setForm();
  }

  ionViewWillLeave() {
    this.profilesHelper.isFromGuardHasBeenCalled();
  }

  save() {
    if (this.form.valid) {
      this.disabledButton = true;
      this.apiProfiles.crud.update(this.form.value).subscribe(() => {
        this.toastService.showToast({
          message: this.translate.instant('profiles.user_profile.success_text')
        });
        if (this.profilesHelper.isFromGuard()) {
          const url = this.profilesHelper.getUrlToAccess();
          this.navController.navigateForward([url], { replaceUrl: true });
        } else {
          this.navController.pop();
        }
        this.disabledButton = false;
      });
    }
  }

  setForm() {
    this.apiRuns.hasActive().subscribe((hasActiveRuns: boolean) => {
      if (hasActiveRuns) {
        this.addRequiredValidator();
      }
      this.form = this.formBuilder.group({ ...this.controls });
      this.isFormSet = true;
      this.apiProfiles.crud.get().subscribe(res => this.form.patchValue(res));
    });
  }

  addRequiredValidator() {
    for (const key in this.controls) {
      if (Array.isArray(this.controls[key])) {
        this.controls[key][1] = [Validators.required, ...this.controls[key][1]];
      }
    }
  }
}
