import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';

@Component({
  selector: 'app-user-profile',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Perfil de Usuario</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form [formGroup]="this.form" (ngSubmit)="this.save()">
        <ion-item-group class="ion-padding-top">
          <ion-item-divider>
            <ion-label>DATOS PERSONALES</ion-label>
          </ion-item-divider>
          <div class="ion-padding-start ion-padding-end">
            <ion-item>
              <ion-label position="floating">Nombre</ion-label>
              <ion-input formControlName="first_name" type="text"></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="first_name"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">Apellido</ion-label>
              <ion-input formControlName="last_name" type="text"></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="last_name"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">DNI</ion-label>
              <ion-input
                formControlName="nro_dni"
                type="text"
                inputmode="numeric"
              ></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="nro_dni"
              [errors]="this.onlyNumbersErrors"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">Celular</ion-label>
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
            <ion-label>DATOS DE FACTURACIÓN</ion-label>
          </ion-item-divider>
          <div class="ion-padding-start ion-padding-end">
            <ion-item>
              <ion-label position="floating">Condición IVA</ion-label>
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
              <ion-label position="floating">Tipo Factura</ion-label>
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
              <ion-label position="floating">CUIT</ion-label>
              <ion-input
                formControlName="cuit"
                type="text"
                inputmode="numeric"
              ></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="cuit"
              [errors]="this.onlyNumbersErrors"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">Dirección</ion-label>
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
            expand="block"
            size="large"
            type="submit"
            color="success"
            [disabled]="
              !this.form.valid || (this.submitButtonService.isDisabled | async)
            "
          >
            <ion-icon slot="start" name="save"></ion-icon>
            Guardar
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit {
  cellphoneErrors: ItemFormError[] = CONFIG.fieldErrors.cellphone;

  onlyNumbersErrors: ItemFormError[] = CONFIG.fieldErrors.onlyNumbers;

  form: FormGroup = this.formBuilder.group({
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
    condicion_iva: [''],
    tipo_factura: [''],
    cuit: [
      '',
      [
        Validators.minLength(7),
        Validators.maxLength(15),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ],
    direccion: ['', Validators.maxLength(150)]
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private apiProfiles: ApiProfilesService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.apiProfiles.crud.get('').subscribe((res) => this.form.patchValue(res));
  }

  save() {
    if (this.form.valid) {
      this.apiProfiles.crud.update(this.form.value).subscribe(() =>
        this.toastService.showToast({
          message: 'Datos guardados!'
        })
      );
    }
  }
}
