import { Component } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { Countries } from '../enums/countries.enum';
import { MARITAL_STATUS } from '../constants/marital-status';
import { GENDERS } from '../constants/gender';
import { DOC_TYPES } from '../constants/doc_types';
import { NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { UtcFormatOf } from '../../../shared/models/utc-format-of/utc-format-of';
import { subYears } from 'date-fns';

@Component({
  selector: 'app-user-information',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/new-operation/moonpay"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.register.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding rp">
      <div class="rp__logo">
        <img src="assets/img/logo_kripton.png" alt="Logo kripton" />
      </div>

      <app-ux-text class="ion-padding-top ion-margin-top">
        <div class="ion-margin-top ion-margin-bottom ux-font-text-xs" color="primary">
          {{ 'fiat_ramps.register.description' | translate }}
        </div>
      </app-ux-text>

      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <app-ux-input
            controlName="nombre"
            type="text"
            [label]="'fiat_ramps.register.first_name' | translate"
            inputmode="text"
            [placeholder]="'fiat_ramps.register.first_name' | translate"
          ></app-ux-input>

          <app-ux-input
            controlName="apellido"
            type="text"
            [label]="'fiat_ramps.register.last_name' | translate"
            inputmode="text"
            [placeholder]="'fiat_ramps.register.last_name' | translate"
          ></app-ux-input>

          <app-ux-input-select
            [label]="'fiat_ramps.register.nationality' | translate"
            [modalTitle]="'fiat_ramps.register.nationality' | translate"
            [placeholder]="'fiat_ramps.register.nationality' | translate"
            controlName="nacionalidad"
            [data]="this.countries"
          ></app-ux-input-select>

          <app-ux-input
            placeholder="DD-MM-YYYY"
            [label]="'fiat_ramps.register.dob' | translate"
            controlName="nacimiento"
          >
          </app-ux-input>

          <app-input-select
            [label]="'fiat_ramps.register.gender' | translate"
            [modalTitle]="'fiat_ramps.register.gender' | translate"
            [placeholder]="'fiat_ramps.register.gender' | translate"
            controlName="genero"
            [data]="this.genders"
            key="value"
            valueKey="value"
            [translated]="true"
          ></app-input-select>

          <app-input-select
            [label]="'fiat_ramps.register.marital_status' | translate"
            [modalTitle]="'fiat_ramps.register.marital_status' | translate"
            [placeholder]="'fiat_ramps.register.marital_status' | translate"
            controlName="estado_civil"
            [data]="this.maritalStatus"
            key="value"
            valueKey="value"
            [translated]="true"
          ></app-input-select>

          <app-input-select
            [label]="'fiat_ramps.register.doc_type' | translate"
            [modalTitle]="'fiat_ramps.register.doc_type' | translate"
            [placeholder]="'fiat_ramps.register.doc_type' | translate"
            controlName="tipo_doc"
            [data]="this.docTypes"
            key="value"
            valueKey="value"
            [translated]="true"
          ></app-input-select>

          <app-ux-input
            controlName="nro_doc"
            type="text"
            inputmode="numeric"
            [label]="'fiat_ramps.register.doc_number' | translate"
            [placeholder]="'fiat_ramps.register.doc_number' | translate"
          ></app-ux-input>

          <app-ux-input
            controlName="ciudad"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.city' | translate"
            [placeholder]="'fiat_ramps.register.city' | translate"
          ></app-ux-input>

          <app-ux-input
            controlName="codigo_postal"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.postal_code' | translate"
            [placeholder]="'fiat_ramps.register.postal_code' | translate"
          ></app-ux-input>

          <app-ux-input
            controlName="direccion_calle"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.address_street' | translate"
            [placeholder]="'fiat_ramps.register.address_street' | translate"
          ></app-ux-input>

          <app-ux-input
            controlName="direccion_nro"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.address_number' | translate"
            [placeholder]="'fiat_ramps.register.address_number' | translate"
          ></app-ux-input>

          <app-ux-input
            controlName="telefono"
            type="tel"
            inputmode="tel"
            [label]="'fiat_ramps.register.phone' | translate"
            [placeholder]="'fiat_ramps.register.phone' | translate"
          ></app-ux-input>

          <ion-item class="rp__checkbox">
            <app-ux-text class="rp__checkbox__checkbox_text">
              {{ 'fiat_ramps.register.not_politically' | translate }}
            </app-ux-text>

            <app-ux-checkbox
              class="small"
              controlName="expuesto_politicamente"
              color="secondary"
              slot="start"
            ></app-ux-checkbox>
          </ion-item>
        </div>

        <div class="ux_footer">
          <div class="button-next">
            <ion-button class="ux_button" appTrackClick name="Next" type="submit" color="secondary" size="large">
              {{ 'fiat_ramps.register.next' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
    <app-fixed-footer></app-fixed-footer>
  `,
  styleUrls: ['./user-information.page.scss'],
})
export class UserInformationPage {
  form: UntypedFormGroup = this.formBuilder.group({
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
    telefono: ['', [Validators.required]],
    expuesto_politicamente: [false, [Validators.required]],
  });
  genders = GENDERS;
  countries = Object.values(Countries);
  maritalStatus = MARITAL_STATUS;
  docTypes = DOC_TYPES;
  maxDate = this.getLegalAgeBirthDate();

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: UntypedFormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private trackService: TrackService
  ) {}

  ionViewWillEnter() {
    this.trackScreenViewEvent();
  }

  handleSubmit() {
    const parsedValues = this.getParsedValues(this.form.value);
    if (this.form.valid) {
      this.fiatRampsService.registerUserInfo(parsedValues).subscribe((res) => {
        this.navController.navigateForward(['fiat-ramps/user-bank'], { replaceUrl: true });
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  getLegalAgeBirthDate() {
    return new UtcFormatOf(subYears(new Date(), 18)).value();
  }

  getParsedValues(formValues) {
    const valuesCopy = Object.assign({}, formValues);
    valuesCopy.genero = valuesCopy.genero.name;
    valuesCopy.estado_civil = valuesCopy.estado_civil.name;
    valuesCopy.tipo_doc = valuesCopy.tipo_doc.name;
    return valuesCopy;
  }

  trackScreenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_buy_kripton_screenview_pdetails',
    });
  }
}
