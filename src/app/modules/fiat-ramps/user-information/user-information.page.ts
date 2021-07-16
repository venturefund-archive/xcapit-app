import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { Countries } from '../enums/countries.enum';
import { MaritalStatus } from '../enums/marital-status.enums';
import { Province } from '../enums/province.enums';
import { Gender } from '../enums/gender.enums';
import { DocTypes } from '../enums/doc_types.enum';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-user-information',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/operations-new"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'fiat_ramps.register.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding rp">
      <div class="rp__logo">
        <img src="../../assets/img/logo_kripton.png" alt="Logo kripton" />
      </div>

      <app-ux-text class="ion-padding-top ion-margin-top">
        <div class="ion-margin-top ion-margin-bottom" style="font-size: 16px;">
          {{ 'fiat_ramps.register.description' | translate }}
        </div>
      </app-ux-text>

      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <!-- Nombre -->
          <app-ux-input
            controlName="nombre"
            type="text"
            [label]="'fiat_ramps.register.first_name' | translate"
            inputmode="text"
            [placeholder]="'fiat_ramps.register.first_name' | translate"
          ></app-ux-input>

          <!-- Apellido -->
          <app-ux-input
            controlName="apellido"
            type="text"
            [label]="'fiat_ramps.register.last_name' | translate"
            inputmode="text"
            [placeholder]="'fiat_ramps.register.last_name' | translate"
          ></app-ux-input>

          <!-- Nacionalidad -->
          <app-ux-input-select
            [label]="'fiat_ramps.register.nationality' | translate"
            [modalTitle]="'fiat_ramps.register.nationality' | translate"
            [placeholder]="'fiat_ramps.register.nationality' | translate"
            controlName="nacionalidad"
            [data]="this.countries"
          ></app-ux-input-select>

          <!-- fecha de nacimiento -->
          <app-ux-datetime
            controlName="nacimiento"
            [label]="'fiat_ramps.register.dob' | translate"
            [placeholder]="'fiat_ramps.register.dob' | translate"
            [max]="this.maxDate"
          ></app-ux-datetime>

          <!-- Género -->
          <app-ux-input-select
            [label]="'fiat_ramps.register.gender' | translate"
            [modalTitle]="'fiat_ramps.register.gender' | translate"
            [placeholder]="'fiat_ramps.register.gender' | translate"
            controlName="genero"
            [data]="this.translatedGender"
            keyName="name"
            valueName="id"
          ></app-ux-input-select>

          <!-- Estado civil -->
          <app-ux-input-select
            [label]="'fiat_ramps.register.marital_status' | translate"
            [modalTitle]="'fiat_ramps.register.marital_status' | translate"
            [placeholder]="'fiat_ramps.register.marital_status' | translate"
            controlName="estado_civil"
            [data]="this.translatedMaritalStatus"
            keyName="name"
            valueName="id"
          ></app-ux-input-select>

          <!-- Tipo documento -->
          <app-ux-input-select
            [label]="'fiat_ramps.register.doc_type' | translate"
            [modalTitle]="'fiat_ramps.register.doc_type' | translate"
            [placeholder]="'fiat_ramps.register.doc_type' | translate"
            controlName="tipo_doc"
            [data]="this.translatedDocTypes"
            keyName="name"
            valueName="id"
          ></app-ux-input-select>

          <!-- Nro doc -->
          <app-ux-input
            controlName="nro_doc"
            type="text"
            inputmode="numeric"
            [label]="'fiat_ramps.register.doc_number' | translate"
            [placeholder]="'fiat_ramps.register.doc_number' | translate"
          ></app-ux-input>

          <!-- Ciudad -->
          <app-ux-input
            controlName="ciudad"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.city' | translate"
            [placeholder]="'fiat_ramps.register.city' | translate"
          ></app-ux-input>

          <!-- Código postal -->
          <app-ux-input
            controlName="codigo_postal"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.postal_code' | translate"
            [placeholder]="'fiat_ramps.register.postal_code' | translate"
          ></app-ux-input>

          <!-- dirección calle -->
          <app-ux-input
            controlName="direccion_calle"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.address_street' | translate"
            [placeholder]="'fiat_ramps.register.address_street' | translate"
          ></app-ux-input>

          <!-- dirección nro -->
          <app-ux-input
            controlName="direccion_nro"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.address_number' | translate"
            [placeholder]="'fiat_ramps.register.address_number' | translate"
          ></app-ux-input>

          <ion-item class="rp__checkbox">
            <app-ux-text class="rp__checkbox__checkbox_text">
              {{ 'fiat_ramps.register.not_politically' | translate }}
            </app-ux-text>

            <app-ux-checkbox
              class="small"
              controlName="expuesto_politicamente"
              color="uxsecondary"
              slot="start"
            ></app-ux-checkbox>
          </ion-item>
        </div>

        <div class="ux_footer">
          <div class="button-next">
            <ion-button class="ux_button" appTrackClick name="Next" type="submit" color="uxsecondary" size="large">
              {{ 'fiat_ramps.register.next' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./user-information.page.scss'],
})
export class UserInformationPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("[A-Za-zÀ-ÿ '-]*$")]],
    apellido: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("[A-Za-zÀ-ÿ '-]*$")]],
    nacionalidad: ['', [Validators.required]],
    nacimiento: ['', [Validators.required]],
    genero: ['', [Validators.required]],
    estado_civil: ['', [Validators.required]],
    tipo_doc: ['', [Validators.required]],
    nro_doc: [
      '',
      [Validators.required, Validators.minLength(7), Validators.maxLength(12), Validators.pattern('[a-zA-Z0-9]*$')],
    ],
    ciudad: ['', [Validators.required]],
    codigo_postal: ['', [Validators.required]],
    direccion_calle: ['', [Validators.required]],
    direccion_nro: ['', [Validators.required]],
    expuesto_politicamente: [false, [Validators.required]],
  });

  countries = Object.values(Countries);
  translatedMaritalStatus = this.translateEnum(MaritalStatus, 'fiat_ramps.register.marital_status_list.');
  provinces = Object.values(Province);
  translatedGender = this.translateEnum(Gender, 'fiat_ramps.register.gender_list.');
  translatedDocTypes = this.translateEnum(DocTypes, 'fiat_ramps.register.doctypes_list.');
  maxDate = this.getLegalAgeBirthDate();

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  handleSubmit() {
    if (this.form.valid) {
      this.fiatRampsService.registerUserInfo(this.form.value).subscribe((res) => {
        this.navController.navigateForward(['fiat-ramps/user-bank'], { replaceUrl: true });
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  translateEnum(enumSelected, prefix) {
    return Object.keys(enumSelected).map((id) => ({
      name: this.translate.instant(`${prefix}${enumSelected[id]}`),
      id,
    }));
  }

  getLegalAgeBirthDate() {
    return moment().subtract(18, 'y').utc().format();
  }
}
